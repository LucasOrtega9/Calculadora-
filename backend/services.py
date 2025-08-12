from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime, timedelta
import json

from models import User, Ticket, Order, Usage
from schemas import (
    UserCreate, TicketCreate, OrderCreate, UsageCreate,
    DashboardStats, UserStats
)

# Serviços para Usuários
def create_user_service(db: Session, user: UserCreate) -> User:
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users_service(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()

# Serviços para Tickets
def create_ticket_service(db: Session, ticket: TicketCreate) -> Ticket:
    db_ticket = Ticket(**ticket.dict())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_tickets_service(db: Session, skip: int = 0, limit: int = 100) -> List[Ticket]:
    return db.query(Ticket).offset(skip).limit(limit).all()

# Serviços para Orders
def create_order_service(db: Session, order: OrderCreate) -> Order:
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders_service(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
    return db.query(Order).offset(skip).limit(limit).all()

# Serviços para Usage
def create_usage_service(db: Session, usage: UsageCreate) -> Usage:
    db_usage = Usage(**usage.dict())
    db.add(db_usage)
    db.commit()
    db.refresh(db_usage)
    return db_usage

def get_usage_service(db: Session, skip: int = 0, limit: int = 100) -> List[Usage]:
    return db.query(Usage).offset(skip).limit(limit).all()

# Serviços para Dashboard
def get_dashboard_stats(db: Session) -> DashboardStats:
    # Estatísticas de usuários
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    
    # Estatísticas de tickets
    total_tickets = db.query(func.count(Ticket.id)).scalar()
    open_tickets = db.query(func.count(Ticket.id)).filter(Ticket.status.in_(["open", "in_progress"])).scalar()
    
    # Estatísticas de orders
    total_orders = db.query(func.count(Order.id)).scalar()
    pending_orders = db.query(func.count(Order.id)).filter(Order.status == "pending").scalar()
    
    # Estatísticas de uso
    total_usage_minutes = db.query(func.sum(Usage.duration_minutes)).scalar() or 0
    total_usage_hours = total_usage_minutes / 60.0
    
    # Média de duração da sessão
    avg_session = db.query(func.avg(Usage.duration_minutes)).scalar() or 0
    
    # Top features utilizadas
    features_data = db.query(Usage.features_used).filter(Usage.features_used.isnot(None)).all()
    feature_counts = {}
    for row in features_data:
        if row.features_used:
            try:
                features = json.loads(row.features_used)
                if isinstance(features, list):
                    for feature in features:
                        feature_counts[feature] = feature_counts.get(feature, 0) + 1
            except:
                pass
    
    top_features = [{"feature": k, "count": v} for k, v in sorted(feature_counts.items(), key=lambda x: x[1], reverse=True)[:10]]
    
    # Top usuários por uso
    user_usage = db.query(
        User.username,
        func.sum(Usage.duration_minutes).label('total_minutes')
    ).join(Usage).group_by(User.id, User.username).order_by(desc('total_minutes')).limit(10).all()
    
    top_users = [{"username": row.username, "total_hours": round(row.total_minutes / 60, 2)} for row in user_usage]
    
    return DashboardStats(
        total_users=total_users,
        active_users=active_users,
        total_tickets=total_tickets,
        open_tickets=open_tickets,
        total_orders=total_orders,
        pending_orders=pending_orders,
        total_usage_hours=round(total_usage_hours, 2),
        average_session_length=round(avg_session, 2),
        top_features=top_features,
        top_users=top_users
    )

def get_user_stats(db: Session, user_id: int) -> UserStats:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("Usuário não encontrado")
    
    # Estatísticas de tickets
    total_tickets = db.query(func.count(Ticket.id)).filter(Ticket.user_id == user_id).scalar()
    open_tickets = db.query(func.count(Ticket.id)).filter(
        Ticket.user_id == user_id,
        Ticket.status.in_(["open", "in_progress"])
    ).scalar()
    
    # Estatísticas de orders
    total_orders = db.query(func.count(Order.id)).filter(Order.user_id == user_id).scalar()
    total_amount = db.query(func.sum(Order.amount)).filter(
        Order.user_id == user_id,
        Order.status == "completed"
    ).scalar() or 0.0
    
    # Estatísticas de uso
    user_usage = db.query(Usage).filter(Usage.user_id == user_id).all()
    total_usage_minutes = sum(u.duration_minutes for u in user_usage)
    total_usage_hours = total_usage_minutes / 60.0
    
    # Média de duração da sessão
    avg_session = total_usage_minutes / len(user_usage) if user_usage else 0
    
    # Última atividade
    last_activity = db.query(func.max(Usage.timestamp)).filter(Usage.user_id == user_id).scalar()
    
    # Features favoritas
    features_data = [u.features_used for u in user_usage if u.features_used]
    feature_counts = {}
    for features_str in features_data:
        try:
            features = json.loads(features_str)
            if isinstance(features, list):
                for feature in features:
                    feature_counts[feature] = feature_counts.get(feature, 0) + 1
        except:
            pass
    
    favorite_features = [k for k, v in sorted(feature_counts.items(), key=lambda x: x[1], reverse=True)[:5]]
    
    # Projetos trabalhados
    projects = list(set(u.project_name for u in user_usage if u.project_name))
    
    return UserStats(
        user_id=user_id,
        username=user.username,
        total_tickets=total_tickets,
        open_tickets=open_tickets,
        total_orders=total_orders,
        total_amount=round(total_amount, 2),
        total_usage_hours=round(total_usage_hours, 2),
        average_session_length=round(avg_session, 2),
        last_activity=last_activity,
        favorite_features=favorite_features,
        projects_worked=projects
    )