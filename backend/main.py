from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta

from database import engine, get_db
from models import Base, User, Ticket, Order, Usage
from schemas import (
    UserCreate, UserResponse, TicketCreate, TicketResponse,
    OrderCreate, OrderResponse, UsageCreate, UsageResponse,
    DashboardStats, UserStats
)
from services import (
    create_user_service, get_users_service, create_ticket_service,
    get_tickets_service, create_order_service, get_orders_service,
    create_usage_service, get_usage_service, get_dashboard_stats,
    get_user_stats
)

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cursor Monitoring System",
    description="Sistema de monitoramento para uso do Cursor",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas para usuários
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user_service(db, user)

@app.get("/users/", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_users_service(db, skip, limit)

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

# Rotas para chamados/tickets
@app.post("/tickets/", response_model=TicketResponse)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    return create_ticket_service(db, ticket)

@app.get("/tickets/", response_model=List[TicketResponse])
def get_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_tickets_service(db, skip, limit)

@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Chamado não encontrado")
    return ticket

# Rotas para pedidos/orders
@app.post("/orders/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    return create_order_service(db, order)

@app.get("/orders/", response_model=List[OrderResponse])
def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_orders_service(db, skip, limit)

@app.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return order

# Rotas para uso
@app.post("/usage/", response_model=UsageResponse)
def create_usage(usage: UsageCreate, db: Session = Depends(get_db)):
    return create_usage_service(db, usage)

@app.get("/usage/", response_model=List[UsageResponse])
def get_usage(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_usage_service(db, skip, limit)

@app.get("/usage/{usage_id}", response_model=UsageResponse)
def get_usage_by_id(usage_id: int, db: Session = Depends(get_db)):
    usage = db.query(Usage).filter(Usage.id == usage_id).first()
    if not usage:
        raise HTTPException(status_code=404, detail="Registro de uso não encontrado")
    return usage

# Rotas para dashboard
@app.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    return get_dashboard_stats(db)

@app.get("/dashboard/users/{user_id}/stats", response_model=UserStats)
def get_user_dashboard_stats(user_id: int, db: Session = Depends(get_db)):
    return get_user_stats(db, user_id)

@app.get("/dashboard/usage/trends")
def get_usage_trends(days: int = 30, db: Session = Depends(get_db)):
    """Retorna tendências de uso nos últimos N dias"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    usage_data = db.query(Usage).filter(
        Usage.timestamp >= start_date,
        Usage.timestamp <= end_date
    ).all()
    
    # Agrupar por data
    daily_usage = {}
    for usage in usage_data:
        date_key = usage.timestamp.date().isoformat()
        if date_key not in daily_usage:
            daily_usage[date_key] = {
                "date": date_key,
                "total_usage": 0,
                "active_users": set()
            }
        daily_usage[date_key]["total_usage"] += usage.duration_minutes
        daily_usage[date_key]["active_users"].add(usage.user_id)
    
    # Converter sets para contadores
    for date_data in daily_usage.values():
        date_data["active_users"] = len(date_data["active_users"])
    
    return list(daily_usage.values())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)