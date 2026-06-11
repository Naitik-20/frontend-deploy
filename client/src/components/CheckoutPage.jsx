import { useEffect, useState } from "react";
import {
  Tag,
  Gift,
  Lock,
  ChevronDown,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Banknote,
  CreditCard,
  Loader2,
  Truck,
  Store,
  MapPin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function CheckoutPage({
  cartItems = [],
  user,
  onLoginClick,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  backendUrl,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "India",
    address: "",
    city: "",
    region: "",
    zip: "",
  });


  const [showPromo, setShowPromo] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [pickupStores, setPickupStores] = useState([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("HOME_DELIVERY");
  const [selectedPickupStoreId, setSelectedPickupStoreId] = useState("");
  const [loadingDeliveryOptions, setLoadingDeliveryOptions] = useState(false);

  const summaryItems = cartItems;
  const totalItems = summaryItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = summaryItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const activeDeliveryMethod =
    deliveryMethods.find((method) => method.code === selectedDeliveryMethod) ||
    deliveryMethods[0] ||
    {
      code: "HOME_DELIVERY",
      name: "Home Delivery",
      baseCharge: 49,
      useProductDeliveryCharge: true,
    };
  const selectedPickupStore = pickupStores.find((store) => store._id === selectedPickupStoreId);
  const cleanZip = String(formData.zip || "").replace(/\D/g, "");
  const isHomeDeliveryMethodAvailable = (method) => {
    if (method.code !== "HOME_DELIVERY") return true;
    const pincodes = Array.isArray(method.servicePincodes) ? method.servicePincodes : [];
    return Boolean(cleanZip) && pincodes.includes(cleanZip);
  };
  const selectedMethodAllowed = isHomeDeliveryMethodAvailable(activeDeliveryMethod);
  const homeDeliveryMethod = deliveryMethods.find((method) => method.code === "HOME_DELIVERY");
  const showHomeDeliveryPincodeMessage =
    checkoutStep >= 2 &&
    cleanZip &&
    homeDeliveryMethod &&
    !isHomeDeliveryMethodAvailable(homeDeliveryMethod);
  const productDeliveryCharge = activeDeliveryMethod.useProductDeliveryCharge === false
    ? 0
    : summaryItems.reduce(
        (acc, item) => acc + Number(item.deliveryPrice || 0) * Number(item.quantity || 1),
        0
      );
  const deliveryBaseCharge = Number(activeDeliveryMethod.baseCharge || 0);
  const delivery = subtotal === 0 ? 0 : deliveryBaseCharge + productDeliveryCharge;
  const total = subtotal + delivery;
  const savings = summaryItems.reduce(
    (acc, item) => acc + ((item.mrp || item.price) - item.price) * item.quantity,
    0
  );

  const getImgSrc = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=60";
    return image.startsWith("http") ? image : `${backendUrl}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const applyAddress = (address) => {
    const nameParts = String(user?.name || "").trim().split(/\s+/).filter(Boolean);
    setFormData({
      firstName: address.firstName || nameParts[0] || user?.shopName || "",
      lastName: address.lastName || nameParts.slice(1).join(" ") || user?.shopName || "",
      phone: address.phone || user?.phone || "",
      country: address.country || "India",
      address: address.address || "",
      city: address.city || "",
      region: address.region || user?.state || "",
      zip: address.zip || user?.pincode || "",
    });
    setSelectedAddressId(address._id || "");
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const isWholesalerUser = user?.role === 'wholesaler' || user?.role === 'wholeseller' || user?.isWholesaler;

  const getOrderPayload = () => ({
    cartItems,
    shippingAddress: formData,
    orderType: isWholesalerUser ? 'WHOLESALER' : 'NORMAL',
    delivery: {
      methodCode: activeDeliveryMethod.code,
      pickupStoreId: activeDeliveryMethod.code === "STORE_PICKUP" ? selectedPickupStoreId : undefined,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          isWholesalerUser ? `${backendUrl}/api/wholesalers/me` : `${backendUrl}/api/auth/me/addresses`,
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const addresses = isWholesalerUser ? data.wholesaler?.addresses || [] : data.addresses || [];
        setSavedAddresses(addresses);
        const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
        if (defaultAddress) {
          applyAddress(defaultAddress);
        }
      } catch {
        setSavedAddresses([]);
      }
    };

    fetchAddresses();
  }, [backendUrl, isWholesalerUser]);

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      setLoadingDeliveryOptions(true);
      try {
        const [methodsResponse, storesResponse] = await Promise.all([
          fetch(`${backendUrl}/api/delivery/methods`),
          fetch(`${backendUrl}/api/delivery/stores`),
        ]);
        const methodsData = await methodsResponse.json();
        const storesData = await storesResponse.json();
        const methods = Array.isArray(methodsData) ? methodsData : [];
        const stores = Array.isArray(storesData) ? storesData : [];

        setDeliveryMethods(methods);
        setPickupStores(stores);

        if (methods.length > 0 && !methods.some((method) => method.code === selectedDeliveryMethod)) {
          setSelectedDeliveryMethod(methods[0].code);
        }
        if (stores.length > 0 && !selectedPickupStoreId) {
          setSelectedPickupStoreId(stores[0]._id);
        }
      } catch {
        setDeliveryMethods([]);
        setPickupStores([]);
      } finally {
        setLoadingDeliveryOptions(false);
      }
    };

    fetchDeliveryOptions();
  }, [backendUrl, selectedDeliveryMethod, selectedPickupStoreId]);

  useEffect(() => {
    if (selectedDeliveryMethod !== "HOME_DELIVERY" || selectedMethodAllowed) return;
    const fallbackMethod = deliveryMethods.find((method) => method.code !== "HOME_DELIVERY");
    if (fallbackMethod) {
      setSelectedDeliveryMethod(fallbackMethod.code);
    }
  }, [deliveryMethods, selectedDeliveryMethod, selectedMethodAllowed]);

  const validateDeliveryDetails = () => {
    const requiredFields = ["firstName", "lastName", "phone", "address", "city", "region", "zip"];
    const missingField = requiredFields.find((field) => !String(formData[field] || "").trim());
    if (missingField) {
      setOrderMessage("Please complete all delivery details before placing the order.");
      setCheckoutStep(1);
      return false;
    }
    return true;
  };

  const validateDeliveryMethod = () => {
    if (!selectedMethodAllowed) {
      setOrderMessage("Home Delivery is not available for your pincode.");
      setCheckoutStep(2);
      return false;
    }
    if (activeDeliveryMethod.code === "STORE_PICKUP" && !selectedPickupStoreId) {
      setOrderMessage("Please select a pickup store before continuing.");
      setCheckoutStep(2);
      return false;
    }
    return true;
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleOrderSuccess = (order) => {
    onClearCart?.();
    navigate(`/invoice/${order._id}`, { state: { order } });
  };

  const placeCodOrder = async () => {
    const response = await fetch(`${backendUrl}/api/orders/cod`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(getOrderPayload()),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Unable to place COD order");
    }

    handleOrderSuccess(data.order);
  };

  const placeOnlineOrder = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Unable to load Razorpay checkout. Please try again.");
    }

    const createResponse = await fetch(`${backendUrl}/api/orders/razorpay/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(getOrderPayload()),
    });

    const createData = await createResponse.json();
    if (!createResponse.ok) {
      throw new Error(createData.message || "Unable to start online payment");
    }

    await new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: createData.keyId,
        amount: createData.razorpayOrder.amount,
        currency: createData.razorpayOrder.currency,
        name: "Dr. Snoopy",
        description: "Pet store order payment",
        order_id: createData.razorpayOrder.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          contact: formData.phone,
          email: user?.email || "",
        },
        notes: {
          city: formData.city,
          pincode: formData.zip,
        },
        theme: {
          color: "#f7931e",
        },
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(`${backendUrl}/api/orders/razorpay/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({
                ...getOrderPayload(),
                ...paymentResponse,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || "Payment verification failed");
            }

            handleOrderSuccess(verifyData.order);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled")),
        },
      });

      razorpay.open();
    });
  };

  const handlePlaceOrder = async () => {
    if (!validateDeliveryDetails()) return;
    if (!validateDeliveryMethod()) return;

    setIsPlacingOrder(true);
    setOrderMessage("");

    try {
      if (paymentMethod === "COD") {
        await placeCodOrder();
      } else {
        await placeOnlineOrder();
      }
    } catch (error) {
      setOrderMessage(error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

  return (
    <div className="checkout-page">

      {/* HEADER */}
      
        <div className="checkout-topbar-inner container">

          <div className="checkout-logo-wrap">

            <h2>Checkout</h2>
          </div>

          <Link to="/" className="checkout-continue-link">
            Continue Browsing
          </Link>

        </div>
    

      {/* MAIN */}
      <div className="checkout-layout container">

        {/* LEFT */}
        <div className="checkout-left">

          
          
          {cartItems.length === 0 ? (
            <div className="checkout-empty-state">
              <ShoppingBag size={42} />
              <h2>Your cart is empty</h2>
              <p>Add products to your cart before starting checkout.</p>
              <button onClick={() => navigate("/shop")}>
                Browse Products
              </button>
            </div>
          ) : (
            <>
          {/* LOGIN STATUS */}
          <div className="checkout-login-box">
            <span>
              {user ? `Logged in as ${user.email || user.name}` : "Login for faster checkout"}
            </span>

            {!user && <button onClick={onLoginClick}>Log in</button>}
          </div>

          {/* TITLE */}
          <h2 className="checkout-section-title">
            Delivery Details
          </h2>

          {checkoutStep===1 && (
           <> 
          {savedAddresses.length > 0 && (
            <div className="checkout-saved-addresses">
              <label>Use saved address</label>
              <div className="checkout-select-wrap">
                <select
                  value={selectedAddressId}
                  onChange={(e) => {
                    const nextAddress = savedAddresses.find((address) => address._id === e.target.value);
                    if (nextAddress) {
                      applyAddress(nextAddress);
                    }
                  }}
                >
                  {savedAddresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.label}{address.isDefault ? " (Default)" : ""} - {address.city}, {address.zip}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
              <Link to="/profile" className="manage-address-link">
                Manage saved addresses
              </Link>
            </div>
          )}


          {/* FORM */}
          <div className="checkout-form-grid">

            <div className="checkout-input-group">
              <label>First name *</label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-input-group">
              <label>Last name *</label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="checkout-input-group">
            <label>Phone *</label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-input-group">
            <label>Country / Region *</label>

            <div className="checkout-select-wrap">

              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option>India</option>
              </select>

              <ChevronDown size={18} />

            </div>
          </div>

          <div className="checkout-input-group">
            <label>Address *</label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-input-group">
            <label>City *</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-input-group">
            <label>Region *</label>

            <div className="checkout-select-wrap">

              <select
  name="region"
  value={formData.region}
  onChange={handleChange}
>
  <option value="">
    Select Region
  </option>

  {indianStates.map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>

              <ChevronDown size={18} />

            </div>
          </div>

          <div className="checkout-input-group">
            <label>Zip / Postal code *</label>

            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
            />
          </div>

          {/* BUTTON */}
          <button className="checkout-save-btn"
          onClick={() => setCheckoutStep(2)}
          >
            Save & Continue
          </button>
         </>
        )}


        {checkoutStep > 1 && (
  <div className="delivery-summary">

    <div className="summary-header">

      <h3>Delivery details</h3>

      <button
        onClick={() => setCheckoutStep(1)}
      >
        Change
      </button>

    </div>

    <p>
      {formData.firstName} {formData.lastName}
    </p>

    <p>{formData.phone}</p>

    <p>
      {formData.address}, {formData.city}
    </p>

  </div>
)}

          {/* DELIVERY */}
          {checkoutStep >=2 && (
          <div className="checkout-next-section">
            <h3>Delivery Method</h3>
            {loadingDeliveryOptions ? (
              <div className="delivery-loading">
                <Loader2 size={18} className="spin-icon" />
                Loading delivery options
              </div>
            ) : (
              <>
                <div className="delivery-method-grid">
                  {(deliveryMethods.length > 0 ? deliveryMethods : [activeDeliveryMethod]).map((method) => {
                    const Icon = method.code === "STORE_PICKUP" ? Store : Truck;
                    const methodProductCharge = method.useProductDeliveryCharge === false ? 0 : productDeliveryCharge;
                    const methodCharge = subtotal === 0 ? 0 : Number(method.baseCharge || 0) + methodProductCharge;
                    const methodAllowed = isHomeDeliveryMethodAvailable(method);

                    return (
                      <label
                        key={method.code}
                        className={`delivery-method-card ${selectedDeliveryMethod === method.code ? "selected" : ""} ${!methodAllowed ? "disabled" : ""}`}
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={method.code}
                          checked={selectedDeliveryMethod === method.code}
                          disabled={!methodAllowed}
                          onChange={(e) => {
                            setSelectedDeliveryMethod(e.target.value);
                            setOrderMessage("");
                          }}
                        />
                        <Icon size={22} />
                        <div>
                          <strong>{method.name}</strong>
                          <span>{method.description || (method.code === "STORE_PICKUP" ? "Collect from an enrolled nearby store." : "Delivered to your address.")}</span>
                          <small>
                            {methodCharge === 0 ? "FREE" : formatPrice(methodCharge)}
                            {method.useProductDeliveryCharge !== false && productDeliveryCharge > 0 ? " incl. product delivery charge" : ""}
                          </small>
                          {!methodAllowed && (
                            <em>Not available for this pincode</em>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {showHomeDeliveryPincodeMessage && (
                  <div className="checkout-message error">
                    <span>Home Delivery is not available for your pincode.</span>
                  </div>
                )}

                {activeDeliveryMethod.code === "STORE_PICKUP" && (
                  <div className="pickup-store-box">
                    <label>Select pickup store</label>
                    {pickupStores.length === 0 ? (
                      <div className="checkout-message error">
                        <span>No pickup stores are active right now.</span>
                      </div>
                    ) : (
                      <div className="checkout-select-wrap">
                        <select
                          value={selectedPickupStoreId}
                          onChange={(e) => setSelectedPickupStoreId(e.target.value)}
                        >
                          {pickupStores.map((store) => (
                            <option key={store._id} value={store._id}>
                              {store.name} - {store.city}, {store.pincode}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={18} />
                      </div>
                    )}

                    {selectedPickupStore && (
                      <div className="pickup-store-card">
                        <MapPin size={17} />
                        <div>
                          <strong>{selectedPickupStore.name}</strong>
                          <span>{selectedPickupStore.address}</span>
                          <span>{selectedPickupStore.city}, {selectedPickupStore.state} - {selectedPickupStore.pincode}</span>
                          <span>{selectedPickupStore.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="delivery-price-breakdown">
                  <div>
                    <span>Method charge</span>
                    <strong>{deliveryBaseCharge === 0 ? "FREE" : formatPrice(deliveryBaseCharge)}</strong>
                  </div>
                  {activeDeliveryMethod.useProductDeliveryCharge !== false && (
                    <div>
                      <span>Product delivery charge</span>
                      <strong>{productDeliveryCharge === 0 ? "FREE" : formatPrice(productDeliveryCharge)}</strong>
                    </div>
                  )}
                </div>

                {orderMessage && checkoutStep === 2 && (
                  <div className="checkout-message error">
                    <span>{orderMessage}</span>
                  </div>
                )}

                <button
                  className="checkout-save-btn"
                  onClick={() => {
                    if (validateDeliveryMethod()) setCheckoutStep(3);
                  }}
                >
                  Continue
                </button>
              </>
            )}
          </div>
          
          )}

          {/* PAYMENT */}
          {checkoutStep >=3 &&(
          <div className="checkout-next-section">
            <h3>Payment</h3>
            <div className="payment-method-grid">
              <label className={`payment-method-card ${paymentMethod === "COD" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Banknote size={22} />
                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your order arrives.</span>
                </div>
              </label>

              <label className={`payment-method-card ${paymentMethod === "ONLINE" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={22} />
                <div>
                  <strong>Online Payment</strong>
                  <span>Pay securely with Razorpay.</span>
                </div>
              </label>
            </div>

            {orderMessage && (
              <div className="checkout-message error">
                <span>{orderMessage}</span>
              </div>
            )}

            <button
              className="checkout-save-btn"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || cartItems.length === 0}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 size={18} className="spin-icon" />
                  Processing
                </>
              ) : paymentMethod === "COD" ? (
                "Place COD Order"
              ) : (
                "Pay Online"
              )}
            </button>
          </div>
          )}
          </>
          )}

        </div>

        {/* RIGHT */}
        <div className="checkout-right">

          <div className="checkout-summary-card">

            <div className="checkout-summary-header">

              <h2>
                Order Summary
                <span>
                  ({totalItems} item{totalItems !== 1 ? "s" : ""})
                </span>
              </h2>

            </div>

            {/* ITEMS */}
            <div className="checkout-items">

              {summaryItems.length === 0 ? (
                <div className="checkout-summary-empty">
                  No items in cart
                </div>
              ) : summaryItems.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id || item.product}
                >

                  <div className="checkout-item-left">

                    <div className="checkout-item-image-wrap">
                      <img
                        src={getImgSrc(item.image)}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=60";
                        }}
                      />

                      <span>
                        {item.quantity}
                      </span>
                    </div>

                    <div>
                      <h4>{item.name}</h4>
                      <p className="checkout-item-moq">
                        {item.moqLabel || 'MOQ'}: <strong>{Math.max(1, Number(item.moq || 1))} pcs</strong>
                      </p>
                      <div className="checkout-qty-ctrl">
                        <button
                          onClick={() => {
                            const minimumQty = Math.max(1, Number(item.moq || 1));
                            if (item.quantity <= minimumQty) onRemoveItem(item.id);
                            else onUpdateQuantity(item.id, item.quantity - 1);
                          }}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={12} />
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          className="checkout-remove-item"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="checkout-item-price">

                    {item.mrp > item.price && (
                      <p className="checkout-old-price">
                        {formatPrice(item.mrp * item.quantity)}
                      </p>
                    )}

                    <h5>
                      {formatPrice(item.price * item.quantity)}
                    </h5>

                  </div>

                </div>
              ))}

            </div>

            <div className="checkout-promo-box">

  {/* PROMO CODE */}

  <div className="promo-section">

    <button
      className="promo-toggle"
      onClick={() => setShowPromo(!showPromo)}
    >
      <div>
        <Tag size={17} />
        <span>Enter a promo code</span>
      </div>
    </button>

    {showPromo && (
      <div className="promo-input-wrap">

        <input
          type="text"
          placeholder="e.g., SAVE50"
        />

        <button>
          Apply
        </button>

      </div>
    )}

  </div>

  {/* GIFT CARD */}

  <div className="promo-section">

    <button
      className="promo-toggle"
      onClick={() => setShowGift(!showGift)}
    >
      <div>
        <Gift size={17} />
        <span>Redeem a gift card</span>
      </div>
    </button>

    {showGift && (
      <div className="promo-input-wrap">

        <input
          type="text"
          placeholder="Enter your code"
        />

        <button>
          Apply
        </button>

      </div>
    )}

  </div>

</div>
            {/* TOTALS */}
            <div className="checkout-totals">

              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {savings > 0 && (
                <div className="checkout-total-row savings">
                  <span>You Save</span>
                  <span>- {formatPrice(savings)}</span>
                </div>
              )}

              <div className="checkout-total-row">
                <span>Delivery ({activeDeliveryMethod.name})</span>
                <span>{delivery === 0 ? "FREE" : formatPrice(delivery)}</span>
              </div>

              {delivery > 0 && (
                <div className="checkout-delivery-mini">
                  <span>Base: {deliveryBaseCharge === 0 ? "FREE" : formatPrice(deliveryBaseCharge)}</span>
                  {activeDeliveryMethod.useProductDeliveryCharge !== false && (
                    <span>Product: {productDeliveryCharge === 0 ? "FREE" : formatPrice(productDeliveryCharge)}</span>
                  )}
                </div>
              )}

              <div className="checkout-total-row final">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

            </div>

            {/* SECURE */}
            <div className="checkout-secure">
              <Lock size={15} />
              Secure Checkout
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .checkout-page {
          background: #f6efe6;
          min-height: 100vh;
          color: var(--text-dark);
        }

        .container {
          width: min(1280px, 92%);
          margin: auto;
        }

        /* TOPBAR */

        .checkout-topbar {
          background: #f6efe6;
          border-bottom:none;
  padding:20px 0;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .checkout-topbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
        }

        .checkout-logo-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .checkout-logo {
          width: 55px;
          height: 55px;
          object-fit: contain;
        }

        .checkout-logo-wrap h2{
  font-family:'Playfair Display',serif;
  font-size:42px;
  color:#0b3d2e;
  text-transform:none;
}

        .checkout-continue-link {
          color: var(--primary-color);
          font-weight: 700;
          text-decoration: underline;
        }

        /* MAIN */

        .checkout-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 42px;
          padding: 40px 0 70px;
        }

        /* LEFT */

        .checkout-left{
  padding:28px;
}

.checkout-summary-card{
  padding:24px;
}

        .checkout-left {
          background: white;
          border-radius: 24px;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }

        .checkout-empty-state {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 14px;
          color: var(--text-medium);
        }

        .checkout-empty-state svg {
          color: var(--secondary-color);
        }

        .checkout-empty-state h2 {
          font-family: var(--font-headers);
          font-size: 34px;
          color: var(--text-dark);
        }

        .checkout-empty-state button {
          border: none;
          background: var(--secondary-color);
          color: white;
          border-radius: 14px;
          padding: 14px 28px;
          font-weight: 800;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .checkout-empty-state button:hover {
          background: var(--secondary-hover);
          transform: translateY(-2px);
        }

        .checkout-login-box {
          background: #fff7ed;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 34px;
        }

        .checkout-login-box button {
          background: transparent;
          border: none;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 600;
        }

        .checkout-section-title {
         font-family:'Playfair Display',serif;
color:#0b3d2e;
font-weight:700;
       
          margin-bottom: 32px;
          font-family: var(--font-headers);
        
        }

        .checkout-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }

        .checkout-input-group {
          margin-bottom: 24px;
        }

        .checkout-saved-addresses {
          border: 1px solid var(--border-light);
          background: var(--bg-main);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 24px;
        }

        .checkout-saved-addresses label {
          display: block;
          margin-bottom: 10px;
          font-weight: 800;
          font-size: 14px;
        }

        .manage-address-link {
          display: inline-block;
          margin-top: 12px;
          color: var(--primary-color);
          font-weight: 800;
          font-size: 14px;
        }

        .checkout-input-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 700;
          font-size: 14px;
        }

        .checkout-input-group input,
        .checkout-select-wrap select {
         background:#faf7f2;
  border:1px solid #e5ddd1;
  border-radius:14px;
  padding:15px;
          width: 100%;
         
          font-size: 15px;
        }

        .checkout-input-group input:focus,
        .checkout-select-wrap select:focus {
         border-color:#f5a623;
  box-shadow:0 0 0 4px rgba(245,166,35,.15);
        }

        .checkout-select-wrap {
          position: relative;
        }

        .checkout-select-wrap svg {
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text-medium);
        }

        .checkout-select-wrap select {
          appearance: none;
        }

        .checkout-save-btn {
          width: 100%;
          border: none;
          background:#f5a623;
  border-radius:14px;
  font-weight:700;
  box-shadow:0 8px 20px rgba(245,166,35,.25);
          color: white;
         
          padding: 18px;
          font-size: 16px;
        
          cursor: pointer;
          margin-top: 10px;
          transition: 0.2s;
        }

        .checkout-save-btn:hover {
          background: var(--secondary-hover);
          transform: translateY(-2px);
        }

        .checkout-save-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .checkout-save-btn .spin-icon {
          animation: spin 0.9s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        .checkout-next-section {
          padding-top: 38px;
          margin-top: 38px;
          border-top: 1px solid var(--border-light);
        }

        .checkout-next-section h3 {
         font-family:'Playfair Display',serif;
color:#0b3d2e;
font-weight:700;
        }

        .payment-method-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .delivery-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-medium);
          font-weight: 800;
          margin-top: 18px;
        }

        .delivery-method-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .delivery-method-card {
       
           background:#fff;
  border:1px solid #ece5da;
  border-radius:18px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          transition: var(--transition-smooth);
         
          min-height: 142px;
        }

        .delivery-method-card.selected {
           border-color:#f5a623;
  background:#fffaf1;
          box-shadow: 0 0 0 3px rgba(247, 147, 30, 0.12);
        }

        .delivery-method-card.disabled {
          opacity: 0.58;
          cursor: not-allowed;
          background: #f8fafc;
        }

        .delivery-method-card input {
          margin-top: 4px;
          accent-color: var(--secondary-color);
        }

        .delivery-method-card svg {
          color: var(--secondary-color);
          flex-shrink: 0;
        }

        .delivery-method-card strong,
        .delivery-method-card span,
        .delivery-method-card small {
          display: block;
        }

        .delivery-method-card strong {
          font-size: 15px;
          color: var(--text-dark);
          margin-bottom: 4px;
        }

        .delivery-method-card span {
          font-size: 13px;
          color: var(--text-medium);
          line-height: 1.4;
        }

        .delivery-method-card small {
          color: var(--primary-color);
          font-weight: 900;
          margin-top: 9px;
        }

        .delivery-method-card em {
          display: block;
          margin-top: 8px;
          color: #dc2626;
          font-size: 12px;
          font-style: normal;
          font-weight: 800;
        }

        .pickup-store-box {
          margin-top: 18px;
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 18px;
          background: var(--bg-main);
        }

        .pickup-store-box > label {
          display: block;
          margin-bottom: 10px;
          font-weight: 800;
          font-size: 14px;
        }

        .pickup-store-card {
          margin-top: 14px;
          display: flex;
          gap: 10px;
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 14px;
          padding: 14px;
        }

        .pickup-store-card svg {
          color: var(--secondary-color);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .pickup-store-card strong,
        .pickup-store-card span {
          display: block;
        }

        .pickup-store-card strong {
          color: var(--text-dark);
          margin-bottom: 5px;
        }

        .pickup-store-card span {
          color: var(--text-medium);
          font-size: 13px;
          line-height: 1.5;
        }

        .delivery-price-breakdown {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .delivery-price-breakdown div {
          border: 1px solid var(--border-light);
          border-radius: 14px;
          padding: 13px 14px;
          background: white;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 14px;
        }

        .delivery-price-breakdown span {
          color: var(--text-medium);
        }

        .delivery-price-breakdown strong {
          color: var(--primary-color);
        }

        .payment-method-card {
         background:#fff;
  border:1px solid #ece5da;
  border-radius:18px;
         
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          transition: var(--transition-smooth);
         
        }

        .payment-method-card.selected {
         border-color:#f5a623;
  background:#fffaf1;
        
          box-shadow: 0 0 0 3px rgba(247, 147, 30, 0.12);
        }

        .payment-method-card input {
          margin-top: 4px;
          accent-color: var(--secondary-color);
        }

        .payment-method-card svg {
          color: var(--secondary-color);
          flex-shrink: 0;
        }

        .payment-method-card strong,
        .payment-method-card span {
          display: block;
        }

        .payment-method-card strong {
          font-size: 15px;
          color: var(--text-dark);
          margin-bottom: 4px;
        }

        .payment-method-card span {
          font-size: 13px;
          color: var(--text-medium);
          line-height: 1.4;
        }

        .checkout-message {
          margin-top: 18px;
          padding: 13px 14px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkout-message.success {
          background: #f0fdf4;
          color: #15803d;
        }

        .checkout-message.error {
          background: #fef2f2;
          color: #dc2626;
        }

        /* RIGHT */

        .checkout-right {
          position: sticky;
          top: 110px;
          height: fit-content;
        }

        .checkout-summary-card {
          background: white;
          border-radius: 24px;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }

        .checkout-summary-header {
          margin-bottom: 30px;
        }

        .checkout-summary-header h2 {
          font-size: 32px;
          font-family:'Playfair Display',serif;
          color:#0b3d2e;
        }

        .checkout-summary-header span {
          font-size: 18px;
          color: var(--text-medium);
        }

        .checkout-items {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 30px;
        }

        .checkout-summary-empty {
          border: 1px dashed var(--border-light);
          border-radius: 14px;
          padding: 24px;
          text-align: center;
          color: var(--text-medium);
          font-weight: 700;
        }

        .checkout-item {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .checkout-item-left {
          display: flex;
          gap: 16px;
          flex: 1;
        }

        .checkout-item-image-wrap {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .checkout-item-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .checkout-item-image-wrap span {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: var(--text-dark);
          color: white;
          border-radius: 50%;
          font-size: 12px;
          display: grid;
          place-items: center;
        }

        .checkout-item h4 {
          font-size: 15px;
          line-height: 1.6;
        }

        .checkout-item-moq {
          width: fit-content;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 3px 7px;
          margin: 4px 0 8px;
          font-size: 11px;
          color: var(--text-medium);
        }

        .checkout-item-moq strong {
          color: var(--primary-color);
        }

        .checkout-qty-ctrl {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .checkout-qty-ctrl button {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          background: white;
          color: var(--text-dark);
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .checkout-qty-ctrl strong {
          min-width: 18px;
          text-align: center;
          font-size: 13px;
        }

        .checkout-qty-ctrl .checkout-remove-item {
          color: #ef4444;
        }

        .checkout-old-price {
          text-decoration: line-through;
          color: var(--text-light);
          font-size: 14px;
        }

        .checkout-item-price h5 {
          color:#0b3d2e;
  font-size:24px;
        }

        .delivery-summary {
  padding-bottom: 30px;
  border-bottom: 1px solid var(--border-light);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-header h3 {
  font-family:'Playfair Display',serif;
color:#0b3d2e;
font-weight:700;
}

.summary-header button {
  background: transparent;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
}

.delivery-summary p {
  color: var(--text-medium);
  line-height: 1.8;
}


.checkout-steps{
  display:flex;
  align-items:center;
  justify-content:space-between;

  margin-bottom:40px;
  padding:20px 24px;

  background:#fff;
  border-radius:18px;

  border:1px solid #ece5da;

  box-shadow:0 6px 20px rgba(0,0,0,.04);
}

.checkout-steps div{
  flex:1;

  text-align:center;

  position:relative;

  font-size:15px;
  font-weight:600;

  color:#9ca3af;

  transition:.3s;
}

.checkout-steps div:not(:last-child)::after{
  content:"";

  position:absolute;

  top:50%;
  right:-50%;

  width:100%;
  height:2px;

  background:#e5ddd1;

  transform:translateY(-50%);

  z-index:1;
}

.checkout-steps div::before{
  content:"";

  display:block;

  width:38px;
  height:38px;

  margin:0 auto 10px;

  border-radius:50%;

  background:#f3f4f6;

  border:2px solid #d1d5db;

  position:relative;

  z-index:2;

  transition:.3s;
}

.checkout-steps div.active{
  color:#0b3d2e;
  font-weight:700;
}

.checkout-steps div.active::before{
  background:#f5a623;
  border-color:#f5a623;

  box-shadow:0 6px 16px rgba(245,166,35,.35);
}

.checkout-steps div.active:not(:last-child)::after{
  background:#f5a623;
}

        .checkout-promo-box {
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 22px;
  margin-bottom: 30px;
}

.promo-section + .promo-section {
  margin-top: 18px;
}

.promo-toggle {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0;
}

.promo-toggle div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.promo-toggle span {
  font-size: 16px;
  text-decoration: underline;
  color: var(--text-dark);
}

.promo-input-wrap {
  display: flex;
  gap: 14px;
  margin-top: 18px;
}

.promo-input-wrap input {
  flex: 1;
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
}

.promo-input-wrap input:focus {
  outline: none;
  border-color: var(--secondary-color);
}

.promo-input-wrap button {
  border: none;
  background: #9ca3af;
  color: white;
  border-radius: 12px;
  padding: 0 24px;
  font-weight: 700;
  cursor: pointer;
}

        .checkout-totals {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .checkout-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
        }

        .checkout-total-row.savings {
          color: #16a34a;
          font-weight: 700;
        }

        .checkout-delivery-mini {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          flex-wrap: wrap;
          color: var(--text-medium);
          font-size: 12px;
          font-weight: 700;
          margin-top: -8px;
        }

        .checkout-total-row.final {
          font-size: 34px;
          font-weight:800;
  font-family:'Playfair Display',serif;
          color: #ob3d2e
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }

        .checkout-secure {
          margin-top: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--secondary-color);
          font-weight: 700;
        }

        /* RESPONSIVE */

        @media (max-width: 1024px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .checkout-right {
            position: static;
          }
        }

        @media (max-width: 640px) {

           .promo-input-wrap {
             flex-direction: column;
            }

            .promo-input-wrap button {
              padding: 14px;
            }

          .checkout-topbar-inner {
            flex-direction: column;
            gap: 14px;
          }

          .checkout-form-grid {
            display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:16px;
          }

          .payment-method-grid {
            grid-template-columns: 1fr;
          }

          .delivery-method-grid,
          .delivery-price-breakdown {
            grid-template-columns: 1fr;
          }

         .checkout-left,
.checkout-summary-card{
  background:#fff;
  border-radius:24px;
  border:1px solid #ece5da;
  box-shadow:0 10px 30px rgba(0,0,0,.05);
}

          .checkout-logo-wrap h2 {
            font-size: 24px;
          }

          .checkout-section-title,
          .checkout-summary-header h2 {
            font-size: 28px;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
