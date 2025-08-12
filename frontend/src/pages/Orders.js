import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Tag, Space, message, Popconfirm, Row, Col, Statistic, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders/');
      setOrders(response.data);
    } catch (error) {
      message.error('Erro ao carregar pedidos');
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

  const handleCreateOrder = () => {
    setEditingOrder(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    form.setFieldsValue(order);
    setModalVisible(true);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Aqui você implementaria a chamada para deletar o pedido
      message.success('Pedido deletado com sucesso');
      fetchOrders();
    } catch (error) {
      message.error('Erro ao deletar pedido');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingOrder) {
        // Atualizar pedido existente
        await axios.put(`/orders/${editingOrder.id}`, values);
        message.success('Pedido atualizado com sucesso');
      } else {
        // Criar novo pedido
        await axios.post('/orders/', values);
        message.success('Pedido criado com sucesso');
      }
      
      setModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error('Erro ao salvar pedido');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'approved': 'blue',
      'completed': 'green',
      'cancelled': 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const formatCurrency = (amount, currency = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Número do Pedido',
      dataIndex: 'order_number',
      key: 'order_number',
      width: 150,
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => formatCurrency(amount, record.currency),
      width: 120,
    },
    {
      title: 'Moeda',
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
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
      title: 'Solicitante',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.username : userId;
      },
    },
    {
      title: 'Aprovador',
      dataIndex: 'approved_by',
      key: 'approved_by',
      render: (approvedBy) => {
        if (!approvedBy) return '-';
        const user = users.find(u => u.id === approvedBy);
        return user ? user.username : approvedBy;
      },
    },
    {
      title: 'Data de Criação',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Data de Conclusão',
      dataIndex: 'completed_at',
      key: 'completed_at',
      render: (date) => date ? new Date(date).toLocaleDateString('pt-BR') : '-',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleEditOrder(record)}
            title="Visualizar"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditOrder(record)}
            title="Editar"
          />
          <Popconfirm
            title="Tem certeza que deseja deletar este pedido?"
            onConfirm={() => handleDeleteOrder(record.id)}
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

  // Estatísticas dos pedidos
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const approvedOrders = orders.filter(o => o.status === 'approved').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Pedidos</h1>
        <p className="page-description">
          Visualize e gerencie todos os pedidos e solicitações do sistema
        </p>
      </div>

      {/* Estatísticas */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Pedidos"
              value={totalOrders}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pedidos Pendentes"
              value={pendingOrders}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pedidos Aprovados"
              value={approvedOrders}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pedidos Concluídos"
              value={completedOrders}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card>
            <Statistic
              title="Valor Total dos Pedidos"
              value={formatCurrency(totalAmount)}
              valueStyle={{ color: '#722ed1' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <Statistic
              title="Valor Médio por Pedido"
              value={totalOrders > 0 ? formatCurrency(totalAmount / totalOrders) : 'R$ 0,00'}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateOrder}
          >
            Novo Pedido
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} pedidos`,
          }}
        />
      </Card>

      <Modal
        title={editingOrder ? 'Editar Pedido' : 'Novo Pedido'}
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
            name="order_number"
            label="Número do Pedido"
            rules={[{ required: true, message: 'Por favor, insira o número do pedido' }]}
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
                name="amount"
                label="Valor"
                rules={[{ required: true, message: 'Por favor, insira o valor' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={value => value.replace(/\$\s?|(\.*)/g, '')}
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Moeda"
                rules={[{ required: true, message: 'Por favor, selecione a moeda' }]}
              >
                <Select placeholder="Selecione a moeda">
                  <Option value="BRL">Real (BRL)</Option>
                  <Option value="USD">Dólar (USD)</Option>
                  <Option value="EUR">Euro (EUR)</Option>
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
                name="approved_by"
                label="Aprovador"
              >
                <Select placeholder="Selecione o aprovador" allowClear>
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
                {editingOrder ? 'Atualizar' : 'Criar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;