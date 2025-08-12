import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Tag, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/');
      setUsers(response.data);
    } catch (error) {
      message.error('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Aqui você implementaria a chamada para deletar o usuário
      message.success('Usuário deletado com sucesso');
      fetchUsers();
    } catch (error) {
      message.error('Erro ao deletar usuário');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        await axios.put(`/users/${editingUser.id}`, values);
        message.success('Usuário atualizado com sucesso');
      } else {
        // Criar novo usuário
        await axios.post('/users/', values);
        message.success('Usuário criado com sucesso');
      }
      
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('Erro ao salvar usuário');
      console.error(error);
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
      title: 'Nome de Usuário',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Nome Completo',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Função',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : role === 'senior_developer' ? 'orange' : 'blue'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
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
            onClick={() => handleEditUser(record)}
            title="Visualizar"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            title="Editar"
          />
          <Popconfirm
            title="Tem certeza que deseja deletar este usuário?"
            onConfirm={() => handleDeleteUser(record.id)}
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Usuários</h1>
        <p className="page-description">
          Visualize e gerencie todos os usuários do sistema
        </p>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateUser}
          >
            Novo Usuário
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} usuários`,
          }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="Nome de Usuário"
            rules={[{ required: true, message: 'Por favor, insira o nome de usuário' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira o email' },
              { type: 'email', message: 'Por favor, insira um email válido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="full_name"
            label="Nome Completo"
            rules={[{ required: true, message: 'Por favor, insira o nome completo' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="Departamento"
          >
            <Select placeholder="Selecione o departamento">
              <Option value="Desenvolvimento">Desenvolvimento</Option>
              <Option value="Design">Design</Option>
              <Option value="QA">QA</Option>
              <Option value="DevOps">DevOps</Option>
              <Option value="Product">Product</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            label="Função"
            rules={[{ required: true, message: 'Por favor, selecione a função' }]}
          >
            <Select placeholder="Selecione a função">
              <Option value="user">Usuário</Option>
              <Option value="developer">Desenvolvedor</Option>
              <Option value="senior_developer">Desenvolvedor Sênior</Option>
              <Option value="designer">Designer</Option>
              <Option value="tester">Tester</Option>
              <Option value="admin">Administrador</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Atualizar' : 'Criar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;