from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, Ticket, Order, Usage
from datetime import datetime, timedelta
import json
import random

def seed_database():
    # Criar tabelas
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Verificar se já existem dados
        if db.query(User).count() > 0:
            print("Banco já possui dados. Pulando seed.")
            return
        
        print("Populando banco de dados com dados de exemplo...")
        
        # Criar usuários de exemplo
        users_data = [
            {"username": "joao.silva", "email": "joao.silva@empresa.com", "full_name": "João Silva", "department": "Desenvolvimento", "role": "developer"},
            {"username": "maria.santos", "email": "maria.santos@empresa.com", "full_name": "Maria Santos", "department": "Design", "role": "designer"},
            {"username": "pedro.oliveira", "email": "pedro.oliveira@empresa.com", "full_name": "Pedro Oliveira", "department": "Desenvolvimento", "role": "developer"},
            {"username": "ana.costa", "email": "ana.costa@empresa.com", "full_name": "Ana Costa", "department": "QA", "role": "tester"},
            {"username": "carlos.rodrigues", "email": "carlos.rodrigues@empresa.com", "full_name": "Carlos Rodrigues", "department": "Desenvolvimento", "role": "senior_developer"},
        ]
        
        users = []
        for user_data in users_data:
            user = User(**user_data)
            db.add(user)
            users.append(user)
        
        db.commit()
        
        # Criar tickets de exemplo
        tickets_data = [
            {"title": "Bug no sistema de login", "description": "Usuários não conseguem fazer login", "priority": "high", "category": "Bug", "user_id": 1, "status": "open"},
            {"title": "Nova funcionalidade de relatórios", "description": "Implementar sistema de relatórios", "priority": "medium", "category": "Feature", "user_id": 2, "status": "in_progress"},
            {"title": "Melhorar performance da API", "description": "Otimizar consultas do banco", "priority": "medium", "category": "Performance", "user_id": 3, "status": "open"},
            {"title": "Corrigir layout mobile", "description": "Ajustar responsividade", "priority": "low", "category": "UI/UX", "user_id": 4, "status": "resolved"},
            {"title": "Implementar testes automatizados", "description": "Criar suite de testes", "priority": "high", "category": "Testing", "user_id": 5, "status": "open"},
        ]
        
        for ticket_data in tickets_data:
            ticket = Ticket(**ticket_data)
            db.add(ticket)
        
        # Criar orders de exemplo
        orders_data = [
            {"order_number": "ORD-001", "description": "Licenças Cursor Pro", "amount": 299.90, "user_id": 1, "status": "completed"},
            {"order_number": "ORD-002", "description": "Treinamento Cursor", "amount": 150.00, "user_id": 2, "status": "pending"},
            {"order_number": "ORD-003", "description": "Suporte Premium", "amount": 99.90, "user_id": 3, "status": "approved"},
            {"order_number": "ORD-004", "description": "Licenças Cursor Team", "amount": 599.90, "user_id": 4, "status": "completed"},
            {"order_number": "ORD-005", "description": "Consultoria especializada", "amount": 500.00, "user_id": 5, "status": "pending"},
        ]
        
        for order_data in orders_data:
            order = Order(**order_data)
            db.add(order)
        
        # Criar registros de uso de exemplo
        features_list = [
            "code_completion", "refactoring", "debugging", "git_integration", 
            "terminal", "extensions", "themes", "keyboard_shortcuts"
        ]
        
        projects_list = [
            "ecommerce-app", "dashboard-system", "mobile-app", "api-backend", 
            "frontend-website", "data-analytics", "machine-learning"
        ]
        
        file_types_list = [
            "javascript", "typescript", "python", "java", "cpp", "html", "css", 
            "json", "xml", "sql", "yaml", "markdown"
        ]
        
        # Gerar 30 dias de dados de uso
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        for user in users:
            current_date = start_date
            while current_date <= end_date:
                # 70% de chance de ter atividade no dia
                if random.random() < 0.7:
                    # 1-3 sessões por dia
                    num_sessions = random.randint(1, 3)
                    
                    for _ in range(num_sessions):
                        session_start = current_date.replace(
                            hour=random.randint(9, 18),
                            minute=random.randint(0, 59)
                        )
                        
                        duration = random.randint(30, 240)  # 30 min a 4 horas
                        session_end = session_start + timedelta(minutes=duration)
                        
                        # Selecionar features aleatórias
                        num_features = random.randint(2, 5)
                        features = random.sample(features_list, num_features)
                        
                        # Selecionar projeto aleatório
                        project = random.choice(projects_list)
                        
                        # Selecionar tipos de arquivo aleatórios
                        num_file_types = random.randint(3, 8)
                        file_types = random.sample(file_types_list, num_file_types)
                        
                        usage = Usage(
                            user_id=user.id,
                            session_start=session_start,
                            session_end=session_end,
                            duration_minutes=duration,
                            features_used=json.dumps(features),
                            project_name=project,
                            file_types=json.dumps(file_types),
                            timestamp=session_start
                        )
                        db.add(usage)
                
                current_date += timedelta(days=1)
        
        db.commit()
        print("Banco de dados populado com sucesso!")
        
    except Exception as e:
        print(f"Erro ao popular banco: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()