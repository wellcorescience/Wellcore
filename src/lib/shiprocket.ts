/**
 * Shiprocket Utility for Wellcore Science
 * Documentation: https://apidoc.shiprocket.in/
 */

const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL || "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Authenticate with Shiprocket
 */
async function getShiprocketToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.error("Shiprocket credentials missing in .env");
    return null;
  }

  try {
    const response = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
      cachedToken = data.token;
      // Tokens usually last 10 days, but we'll re-fetch every 24 hours to be safe
      tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
      return cachedToken;
    }
    return null;
  } catch (error) {
    console.error("Shiprocket Auth Error:", error);
    return null;
  }
}

/**
 * Create an order in Shiprocket
 */
export async function createShiprocketOrder(order: any) {
  const token = await getShiprocketToken();
  if (!token) return { success: false, error: "Authentication failed" };

  try {
    const payload = {
      order_id: order.orderId,
      order_date: new Date(order.createdAt).toISOString().split("T")[0],
      pickup_location: "Primary", // Should match Shiprocket settings
      billing_customer_name: order.shippingAddress.fullName.split(" ")[0],
      billing_last_name: order.shippingAddress.fullName.split(" ").slice(1).join(" ") || "N/A",
      billing_address: order.shippingAddress.address,
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: "India",
      billing_email: order.user?.email || "customer@example.com",
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: 1,
      order_items: order.orderItems.map((item: any) => ({
        name: item.name,
        sku: item.product.toString().slice(-6),
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: order.totalPrice,
      length: 10, // Placeholder dimensions
      width: 10,
      height: 10,
      weight: 0.5,
    };

    const response = await fetch(`${SHIPROCKET_API_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Shiprocket Order Creation Error:", error);
    return { success: false, error };
  }
}

/**
 * Fetch tracking details
 */
export async function getShiprocketTracking(shipmentId: string) {
  const token = await getShiprocketToken();
  if (!token) return null;

  try {
    const response = await fetch(`${SHIPROCKET_API_URL}/shipments/tracking/${shipmentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Shiprocket Tracking Error:", error);
    return null;
  }
}
