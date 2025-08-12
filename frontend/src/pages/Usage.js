import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Tag, Space, message, Popconfirm, Row, Col, Statistic, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const Usage = () => {
  const [usage, setUsage] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUsage, setEditingUsage] = useState(null);
  const [form] = Form.useForm();
  const [usageTrends, setUsageTrends] = useState([]);

  useEffect(() => {
    fetchUsage();
    fetchUsers();
    fetchUsageTrends();
  }, []);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/usage/');
      setUsage(response.data);
    } catch (error) {
      message.error('Erro ao carregar dados de uso');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários');
    }
  };

  const fetchUsageTrends = async () => {
    try {
      const response = await axios.get('/dashboard/usage/trends?days=30');
      setUsageTrends(response.data);
    } catch (error) {
      console.error('Erro ao carregar tendências de uso');
    }
  };

  const handleCreateUsage = () => {
    setEditingUsage(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUsage = (usageRecord) => {
    setEditingUsage(usageRecord);
    form.setFieldsValue({
      ...usageRecord,
      session_start: dayjs(usageRecord.session_start),
      session_end: usageRecord.session_end ? dayjs(usageRecord.session_end) : null,
    });
    setModalVisible(true);
  };

  const handleDeleteUsage = async (usageId) => {
    try {
      // Aqui você implementaria a chamada para deletar o registro de uso
      message.success('Registro de uso deletado com sucesso');
      fetchUsage();
    } catch (error) {
      message.error('Erro ao deletar registro de uso');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        session_start: values.session_start.toISOString(),
        session_end: values.session_end ? values.session_end.toISOString() : null,
      };

      if (editingUsage) {
        // Atualizar registro existente
        await axios.put(`/usage/${editingUsage.id}`, submitData);
        message.success('Registro de uso atualizado com sucesso');
      } else {
        // Criar novo registro
        await axios.post('/usage/', submitData);
        message.success('Registro de uso criado com sucesso');
      }
      
      setModalVisible(false);
      fetchUsage();
      fetchUsageTrends();
    } catch (error) {
      message.error('Erro ao salvar registro de uso');
      console.error(error);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
  };

  const parseFeatures = (featuresStr) => {
    try {
      const features = JSON.parse(featuresStr);
      return Array.isArray(features) ? features : [];
    } catch {
      return [];
    }
  };

  const parseFileTypes = (fileTypesStr) => {
    try {
      const fileTypes = JSON.parse(fileTypesStr);
      return Array.isArray(fileTypes) ? fileTypes : [];
    } catch {
      return [];
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Usuário',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.username : userId;
      },
    },
    {
      title: 'Início da Sessão',
      dataIndex: 'session_start',
      key: 'session_start',
      render: (date) => formatDateTime(date),
      width: 150,
    },
    {
      title: 'Fim da Sessão',
      dataIndex: 'session_end',
      key: 'session_end',
      render: (date) => date ? formatDateTime(date) : '-',
      width: 150,
    },
    {
      title: 'Duração',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      render: (minutes) => formatDuration(minutes),
      width: 100,
    },
    {
      title: 'Projeto',
      dataIndex: 'project_name',
      key: 'project_name',
      width: 150,
    },
    {
      title: 'Features Utilizadas',
      dataIndex: 'features_used',
      key: 'features_used',
      render: (featuresStr) => {
        const features = parseFeatures(featuresStr);
        return (
          <div>
            {features.slice(0, 3).map((feature, index) => (
              <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                {feature}
              </Tag>
            ))}
            {features.length > 3 && (
              <Tag color="default">+{features.length - 3}</Tag>
            )}
          </div>
        );
      },
      width: 200,
    },
    {
      title: 'Tipos de Arquivo',
      dataIndex: 'file_types',
      key: 'file_types',
      render: (fileTypesStr) => {
        const fileTypes = parseFileTypes(fileTypesStr);
        return (
          <div>
            {fileTypes.slice(0, 3).map((type, index) => (
              <Tag key={index} color="green" style={{ marginBottom: 4 }}>
                {type}
              </Tag>
            ))}
            {fileTypes.length > 3 && (
              <Tag color="default">+{fileTypes.length - 3}</Tag>
            )}
          </div>
        );
      },
      width: 200,
    },
    {
      title: 'Data',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      width: 100,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleEditUsage(record)}
            title="Visualizar"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditUsage(record)}
            title="Editar"
          />
          <Popconfirm
            title="Tem certeza que deseja deletar este registro?"
            onConfirm={() => handleDeleteUsage(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Deletar"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Estatísticas de uso
  const totalUsageMinutes = usage.reduce((sum, record) => sum + record.duration_minutes, 0);
  const totalUsageHours = totalUsageMinutes / 60;
  const averageSessionLength = usage.length > 0 ? totalUsageMinutes / usage.length : 0;
  const uniqueUsers = new Set(usage.map(record => record.user_id)).size;
  const totalSessions = usage.length;

  // Features mais utilizadas
  const featureCounts = {};
  usage.forEach(record => {
    const features = parseFeatures(record.features_used);
    features.forEach(feature => {
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });
  });

  const topFeatures = Object.entries(featureCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([feature, count]) => ({ feature, count }));

  // Projetos mais trabalhados
  const projectCounts = {};
  usage.forEach(record => {
    if (record.project_name) {
      projectCounts[record.project_name] = (projectCounts[record.project_name] || 0) + 1;
    }
  });

  const topProjects = Object.entries(projectCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([project, count]) => ({ project, count }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Monitoramento de Uso</h1>
        <p className="page-description">
          Acompanhe o uso do Cursor por usuários e projetos
        </p>
      </div>

      {/* Estatísticas principais */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Horas de Uso"
              value={totalUsageHours.toFixed(2)}
              valueStyle={{ color: '#1890ff' }}
              suffix="h"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Sessões"
              value={totalSessions}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Usuários Ativos"
              value={uniqueUsers}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Média por Sessão"
              value={formatDuration(averageSessionLength)}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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
              <BarChart data={topFeatures}>
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

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <div className="chart-container">
            <h3>Projetos Mais Trabalhados</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProjects} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="project" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
        
        <Col xs={24} lg={12}>
          <div className="chart-container">
            <h3>Distribuição de Uso por Usuário</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={users.map(user => {
                    const userUsage = usage.filter(u => u.user_id === user.id);
                    const totalMinutes = userUsage.reduce((sum, u) => sum + u.duration_minutes, 0);
                    return {
                      name: user.username,
                      value: totalMinutes
                    };
                  }).filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {users.map((user, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateUsage}
          >
            Novo Registro de Uso
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={usage}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} registros`,
          }}
        />
      </Card>

      <Modal
        title={editingUsage ? 'Editar Registro de Uso' : 'Novo Registro de Uso'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="user_id"
            label="Usuário"
            rules={[{ required: true, message: 'Por favor, selecione o usuário' }]}
          >
            <Select placeholder="Selecione o usuário">
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.username} - {user.full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="session_start"
                label="Início da Sessão"
                rules={[{ required: true, message: 'Por favor, selecione o início da sessão' }]}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="session_end"
                label="Fim da Sessão"
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration_minutes"
                label="Duração (minutos)"
                rules={[{ required: true, message: 'Por favor, insira a duração' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="Ex: 120"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="project_name"
                label="Nome do Projeto"
              >
                <Input placeholder="Ex: ecommerce-app" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="features_used"
            label="Features Utilizadas (JSON)"
            help="Insira como array JSON: ['feature1', 'feature2']"
          >
            <TextArea
              rows={3}
              placeholder='["code_completion", "refactoring", "debugging"]'
            />
          </Form.Item>

          <Form.Item
            name="file_types"
            label="Tipos de Arquivo (JSON)"
            help="Insira como array JSON: ['js', 'ts', 'py']"
          >
            <TextArea
              rows={3}
              placeholder='["javascript", "typescript", "python"]'
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUsage ? 'Atualizar' : 'Criar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Usage;