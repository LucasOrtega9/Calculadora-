import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Spin, Alert } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import {
  UserOutlined,
  TicketOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [usageTrends, setUsageTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, trendsResponse] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/dashboard/usage/trends?days=30')
      ]);
      
      setStats(statsResponse.data);
      setUsageTrends(trendsResponse.data);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'red',
      'in_progress': 'orange',
      'resolved': 'green',
      'closed': 'blue',
      'pending': 'orange',
      'approved': 'blue',
      'completed': 'green',
      'cancelled': 'red'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Erro"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: 24 }}
      />
    );
  }

  if (!stats) {
    return <div>Nenhum dado disponível</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard de Monitoramento</h1>
        <p className="page-description">
          Visão geral do uso do Cursor na organização
        </p>
      </div>

      {/* Estatísticas principais */}
      <Row gutter={[16, 16]} className="dashboard-card">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total de Usuários"
              value={stats.total_users}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Chamados Abertos"
              value={stats.open_tickets}
              prefix={<TicketOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Pedidos Pendentes"
              value={stats.pending_orders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total de Uso (horas)"
              value={stats.total_usage_hours}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="h"
            />
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div className="chart-container">
            <h3>Tendência de Uso (Últimos 30 dias)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name === 'total_usage' ? 'Minutos' : 'Usuários Ativos']} />
                <Legend />
                <Line type="monotone" dataKey="total_usage" stroke="#1890ff" name="Total de Uso" />
                <Line type="monotone" dataKey="active_users" stroke="#52c41a" name="Usuários Ativos" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
        
        <Col xs={24} lg={12}>
          <div className="chart-container">
            <h3>Top Features Utilizadas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.top_features}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div className="chart-container">
            <h3>Top Usuários por Uso</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.top_users} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="username" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value} horas`, 'Total de Uso']} />
                <Bar dataKey="total_hours" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
        
        <Col xs={24} lg={12}>
          <div className="chart-container">
            <h3>Resumo de Estatísticas</h3>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Usuários Ativos"
                    value={stats.active_users}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Total de Chamados"
                    value={stats.total_tickets}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Total de Pedidos"
                    value={stats.total_orders}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Média Sessão (min)"
                    value={stats.average_session_length}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;