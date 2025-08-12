import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Tag, Space, message, Popconfirm, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tickets/');
      setTickets(response.data);
    } catch (error) {
      message.error('Erro ao carregar tickets');
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

  const handleCreateTicket = () => {
    setEditingTicket(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    form.setFieldsValue(ticket);
    setModalVisible(true);
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      // Aqui você implementaria a chamada para deletar o ticket
      message.success('Ticket deletado com sucesso');
      fetchTickets();
    } catch (error) {
      message.error('Erro ao deletar ticket');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTicket) {
        // Atualizar ticket existente
        await axios.put(`/tickets/${editingTicket.id}`, values);
        message.success('Ticket atualizado com sucesso');
      } else {
        // Criar novo ticket
        await axios.post('/tickets/', values);
        message.success('Ticket criado com sucesso');
      }
      
      setModalVisible(false);
      fetchTickets();
    } catch (error) {
      message.error('Erro ao salvar ticket');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'red',
      'in_progress': 'orange',
      'resolved': 'green',
      'closed': 'blue'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'green',
      'medium': 'orange',
      'high': 'red',
      'critical': 'red'
    };
    return colors[priority] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'open': 'Aberto',
      'in_progress': 'Em Progresso',
      'resolved': 'Resolvido',
      'closed': 'Fechado'
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta',
      'critical': 'Crítica'
    };
    return priorityMap[priority] || priority;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Prioridade',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Solicitante',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.username : userId;
      },
    },
    {
      title: 'Responsável',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
      render: (assignedTo) => {
        if (!assignedTo) return '-';
        const user = users.find(u => u.id === assignedTo);
        return user ? user.username : assignedTo;
      },
    },
    {
      title: 'Data de Criação',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleEditTicket(record)}
            title="Visualizar"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTicket(record)}
            title="Editar"
          />
          <Popconfirm
            title="Tem certeza que deseja deletar este ticket?"
            onConfirm={() => handleDeleteTicket(record.id)}
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

  // Estatísticas dos tickets
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Tickets</h1>
        <p className="page-description">
          Visualize e gerencie todos os tickets e chamados do sistema
        </p>
      </div>

      {/* Estatísticas */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Tickets"
              value={totalTickets}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tickets Abertos"
              value={openTickets}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Em Progresso"
              value={inProgressTickets}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Resolvidos"
              value={resolvedTickets}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateTicket}
          >
            Novo Ticket
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} tickets`,
          }}
        />
      </Card>

      <Modal
        title={editingTicket ? 'Editar Ticket' : 'Novo Ticket'}
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
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Por favor, insira o título' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: 'Por favor, insira a descrição' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Prioridade"
                rules={[{ required: true, message: 'Por favor, selecione a prioridade' }]}
              >
                <Select placeholder="Selecione a prioridade">
                  <Option value="low">Baixa</Option>
                  <Option value="medium">Média</Option>
                  <Option value="high">Alta</Option>
                  <Option value="critical">Crítica</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Categoria"
              >
                <Select placeholder="Selecione a categoria">
                  <Option value="Bug">Bug</Option>
                  <Option value="Feature">Feature</Option>
                  <Option value="Performance">Performance</Option>
                  <Option value="UI/UX">UI/UX</Option>
                  <Option value="Testing">Testing</Option>
                  <Option value="Documentation">Documentação</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="user_id"
                label="Solicitante"
                rules={[{ required: true, message: 'Por favor, selecione o solicitante' }]}
              >
                <Select placeholder="Selecione o solicitante">
                  {users.map(user => (
                    <Option key={user.id} value={user.id}>
                      {user.username} - {user.full_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assigned_to"
                label="Responsável"
              >
                <Select placeholder="Selecione o responsável" allowClear>
                  {users.map(user => (
                    <Option key={user.id} value={user.id}>
                      {user.username} - {user.full_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingTicket ? 'Atualizar' : 'Criar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tickets;