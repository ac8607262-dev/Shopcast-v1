import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
function App() {
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estados para el formulario de Nueva Categoría
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [descCategoria, setDescCategoria] = useState('');

  // Estados para el formulario de Productos
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  // 1. Obtener productos desde el backend
  const obtenerProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/productos`);
      const data = await response.json();
      if (Array.isArray(data)) setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // 2. Obtener categorías desde el backend
  const obtenerCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categorias`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategorias(data);
        if (data.length > 0 && !categoriaId) {
          setCategoriaId(data[0].id.toString()); // Seleccionar la primera por defecto
        }
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    if (usuario) {
      obtenerProductos();
      obtenerCategorias();
    }
  }, [usuario]);

  // Manejo del Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok && data.id) {
        setUsuario(data);
        obtenerProductos();
        obtenerCategorias();
      } else {
        alert(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error(error);
      alert('No se pudo conectar con el backend.');
    }
  };

  // Crear Nueva Categoría
  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreCategoria,
          descripcion: descCategoria
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`¡Categoría creada con éxito! ID asignado: ${data.id}`);
        setNombreCategoria('');
        setDescCategoria('');
        obtenerCategorias(); // Recargar la lista de categorías
      } else {
        alert(data.error || "Error al guardar la categoría");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al guardar la categoría.");
    }
  };

  // Crear Producto (Asociado a una categoría seleccionada)
  const handleCrearProducto = async (e) => {
    e.preventDefault();
    if (!categoriaId) {
      alert("Por favor selecciona o crea primero una categoría.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria_id: parseInt(categoriaId),
          nombre,
          precio: parseFloat(precio),
          stock: parseInt(stock) || 0,
          descripcion,
          imagen_url: imagenUrl
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || '¡Producto guardado con éxito!');
        obtenerProductos();
        // Limpiar formulario
        setNombre('');
        setPrecio('');
        setStock('');
        setDescripcion('');
        setImagenUrl('');
      } else {
        alert(data.error || "Error al guardar el producto");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al guardar el producto.");
    }
  };

  // Pantalla de Login
  if (!usuario) {
    return (
      <div style={{ padding: '50px', maxWidth: '350px', margin: '50px auto', fontFamily: 'Arial', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#1e3a8a', textAlign: 'center' }}>Ingrese sus credenciales</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '12px' }}>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  // Interfaz Principal
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: 0, color: '#1e3a8a', fontSize: '22px' }}>🛒 Shopcast1 ({usuario.rol.toUpperCase()})</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Hola, <strong>{usuario.nombre}</strong></span>
          <button onClick={() => setUsuario(null)} style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
        </div>
      </header>

      <main style={{ marginTop: '20px' }}>
        {/* PANELES DE GESTIÓN: Para Vendedor y Admin */}
        {(usuario.rol === 'vendedor' || usuario.rol === 'admin') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
            
            {/* 1. FORMULARIO PARA CREAR CATEGORÍA */}
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>🏷️ 1. Crear Nueva Categoría</h3>
              <form onSubmit={handleCrearCategoria} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Nombre de la Categoría</label>
                  <input type="text" placeholder="Ej. Electrodomésticos" value={nombreCategoria} onChange={e => setNombreCategoria(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Descripción de la Categoría</label>
                  <input type="text" placeholder="Descripción breve" value={descCategoria} onChange={e => setDescCategoria(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                </div>
                <button type="submit" style={{ gridColumn: '1 / -1', backgroundColor: '#8b5cf6', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                  Guardar Categoría en SQL
                </button>
              </form>
            </div>

{/* 2. FORMULARIO PARA AGREGAR PRODUCTO */}
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #070707' }}>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>📦 2. Agregar Nuevo Producto</h3>
              <form onSubmit={handleCrearProducto} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', alignItems: 'center' }}>
                
                {/* CAMPO DE CATEGORÍA CON DATALIST (Escribir o Seleccionar) */}
              <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Seleccionar Categoría (ID - Nombre)</label>
                  <select 
                    value={categoriaId} 
                    onChange={e => setCategoriaId(e.target.value)} 
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      boxSizing: 'border-box', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px', 
                      backgroundColor: '#fff', 
                      color: '#000' // Texto negro garantizado
                    }}
                  >
                    {categorias.length === 0 && <option value="">No hay categorías registradas</option>}
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id} style={{ color: '#000', backgroundColor: '#fff' }}>
                        ID: {cat.id} - {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Nombre del Producto</label>
                  <input type="text" placeholder="Ej. Mouse Gamer" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Precio ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={precio} onChange={e => setPrecio(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Stock Disponible</label>
                  <input type="number" placeholder="Cantidad disponible" value={stock} onChange={e => setStock(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Descripción del Producto</label>
                  <input type="text" placeholder="Descripción breve" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>URL de Imagen</label>
                  <input type="text" placeholder="https://..." value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                </div>
                <button type="submit" style={{ gridColumn: '1 / -1', backgroundColor: '#10b981', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Guardar Producto en Base de Datos
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CATÁLOGO DE PRODUCTOS */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#1f2937' }}>🛍️ Catálogo General de Productos</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
            {productos.length > 0 ? productos.map(prod => (
              <div key={prod.id} style={{ border: '1px solid #e5e7eb', padding: '15px', width: '200px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                {prod.imagen_url ? (
                  <img src={prod.imagen_url} alt={prod.nombre} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
                ) : (
                  <div style={{ width: '100%', height: '120px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginBottom: '10px', color: '#6b7280', fontSize: '12px' }}>Sin Imagen</div>
                )}
                <h4 style={{ margin: '0 0 6px 0', color: '#111827' }}>{prod.nombre}</h4>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>Categoría ID: {prod.categoria_id}</p>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#4b5563' }}>{prod.descripcion || 'Sin descripción'}</p>
                <p style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 'bold', color: '#2563eb' }}>${prod.precio}</p>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>Stock disponible: {prod.stock}</p>
                {usuario.rol === 'cliente' && (
                  <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px', width: '100%', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Agregar al Carrito</button>
                )}
              </div>
            )) : <p style={{ color: '#6b7280' }}>No hay productos registrados en la base de datos de Shopcast1.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;