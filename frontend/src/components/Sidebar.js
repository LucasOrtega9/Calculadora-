import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TicketOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Usuários',
    },
    {
      key: '/tickets',
      icon: <TicketOutlined />,
      label: 'Chamados',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Pedidos',
    },
    {
      key: '/usage',
      icon: <BarChartOutlined />,
      label: 'Uso',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider width={250} theme="dark">
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid #303030'
      }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '18px' }}>
          Cursor Monitor
        </h2>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;