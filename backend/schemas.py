from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Schemas para Usuário
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    department: Optional[str] = None
    role: str = "user"

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schemas para Ticket
class TicketBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    category: Optional[str] = None
    user_id: int
    assigned_to: Optional[int] = None

class TicketCreate(TicketBase):
    pass

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    assigned_to: Optional[int] = None
    resolved_at: Optional[datetime] = None

class TicketResponse(TicketBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schemas para Order
class OrderBase(BaseModel):
    order_number: str
    description: Optional[str] = None
    amount: float
    currency: str = "BRL"
    user_id: int
    approved_by: Optional[int] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[str] = None
    approved_by: Optional[int] = None
    completed_at: Optional[datetime] = None

class OrderResponse(OrderBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schemas para Usage
class UsageBase(BaseModel):
    user_id: int
    session_start: datetime
    session_end: Optional[datetime] = None
    duration_minutes: int = 0
    features_used: Optional[str] = None
    project_name: Optional[str] = None
    file_types: Optional[str] = None

class UsageCreate(UsageBase):
    pass

class UsageUpdate(BaseModel):
    session_end: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    features_used: Optional[str] = None
    project_name: Optional[str] = None
    file_types: Optional[str] = None

class UsageResponse(UsageBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

# Schemas para Dashboard
class DashboardStats(BaseModel):
    total_users: int
    active_users: int
    total_tickets: int
    open_tickets: int
    total_orders: int
    pending_orders: int
    total_usage_hours: float
    average_session_length: float
    top_features: List[dict]
    top_users: List[dict]

class UserStats(BaseModel):
    user_id: int
    username: str
    total_tickets: int
    open_tickets: int
    total_orders: int
    total_amount: float
    total_usage_hours: float
    average_session_length: float
    last_activity: Optional[datetime] = None
    favorite_features: List[str]
    projects_worked: List[str]