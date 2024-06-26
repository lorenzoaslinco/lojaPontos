import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageTitle from "../PageTitle/PageTitle";
import ReactModal from "react-modal";
import coinIcon from '../../images/coin.png';
import './Shop.css';

ReactModal.setAppElement('#root');

const Shop = ({ token, userPoints, setUserPoints }) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const navigate = useNavigate();

  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  const openModal = (product) => {
    if (!token) {
      navigate('/login');
    } else {
      setSelectedProduct(product);
      setModalIsOpen(true);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setStreet('');
    setNeighborhood('');
    setHouseNumber('');
    setComplement('');
    setState('');
    setCity('');
    setZipCode('');
  };

  const closeImageModal = () => {
    setImageModalIsOpen(false);
  };

  const handleBuy = async () => {
    if (selectedProduct && street && neighborhood && houseNumber && state && city && zipCode) {
      if (!token) {
        navigate('/login');
      } else {
        const address = {
          street,
          neighborhood,
          houseNumber,
          complement,
          state,
          city,
          zipCode
        };

        if (userPoints >= selectedProduct.price) {
          try {
            const response = await axios.post('http://localhost:5000/api/users/buy', {
              productPrice: selectedProduct.price,
              address,
              productId: selectedProduct._id
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUserPoints(response.data.updatedPoints);
            setMessageType('success');
            setMessage('Compra realizada com sucesso!');
            setTimeout(() => {
              setMessageType('');
              setMessage('');
            }, 2000);
          } catch (error) {
            setMessageType('error');
            setMessage('Erro ao realizar a compra');
            setTimeout(() => {
              setMessageType('');
              setMessage('');
            }, 2000);
          }
        } else {
          setMessageType('error');
          setMessage('Pontos insuficientes para realizar a compra');
          setTimeout(() => {
            setMessageType('');
            setMessage('');
          }, 2000);
        }
        closeModal();
      }
    }
  };

  return (
    <>
      <PageTitle title="Loja" />
      <div className="wrapper">
        <h1 className="title">Bem-vindo à Loja</h1>
        <p className="subtitle">Aqui você pode ver produtos e trocar seus pontos!</p>
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <img 
                src={`http://localhost:5000/${product.imageUrl}`} 
                alt={product.name} 
                className="product-image" 
                onClick={() => openImageModal(`http://localhost:5000/${product.imageUrl}`)} 
              />
              <h3><b>{product.name}</b></h3>
              <p>{product.description}</p>
              <p>
                <img src={coinIcon} alt="ponto" className="point-icon" />
                {product.price}
              </p>
              <button onClick={() => openModal(product)} className="buttonComprar">Comprar</button>
              {message && <p className={`message ${messageType}`}>{message}</p>}
            </div>
          ))}
        </div>
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Endereço de Entrega"
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2>Endereço de Entrega</h2>
          <div className="group-1">
            <input type="text" placeholder="Rua" value={street} onChange={(e) => setStreet(e.target.value)} required className="input input--street" />
            <input type="text" placeholder="Número" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} required className="input input--houseNumber" />
          </div>
          <div className="group-2">
            <input type="text" placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required className="input input--neighborhood" />
            <input type="text" placeholder="Complemento" value={complement} onChange={(e) => setComplement(e.target.value)} required className="input input--complement" />
          </div>
          <div className="group-3">
            <input type="text" placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} required className="input input--city" />
            <select value={state} onChange={(e) => setState(e.target.value)} className="select select--state">
              <option value="">Estado</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <input type="text" placeholder="CEP" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required className="input input--zipCode" />
          </div>
          <div className="buttons">
            <button onClick={handleBuy} className="btn btn--confirmBuy">Confirmar Compra</button>
            <button onClick={closeModal} className="btn btn--cancel">Cancelar</button>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={imageModalIsOpen}
          onRequestClose={closeImageModal}
          contentLabel="Imagem do Produto"
          className="ImageModal"
          overlayClassName="Overlay"
        >
          <img src={selectedImage} alt="Imagem do Produto" className="zoomed-image" />
        </ReactModal>
      </div>
    </>
  );
};

export default Shop;
