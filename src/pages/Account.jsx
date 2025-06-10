import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { loadCartFromSupabase } from "@/lib/supabaseCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PasswordReset from "@/components/PasswordReset";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCurrency } from '@/lib/formatCurrency';
import BulkActions from "@/components/BulkActions";

const getBadgeVariant = (status) => {
  switch (status) {
    case "pending": return "default";
    case "3h jaz2successful": return "success";
    case "cancelled": return "destructive";
    case "refunded": return "outline";
    default: return "secondary";
  }
};



const Account = () => {
  const { user, isAuthenticated, signOut, updateUser } = useAuth((s) => s);
  const { items, setItems } = useCart((s) => s);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [modalOrder, setModalOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSaved, setNameSaved] = useState(false);



  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    if (items.length === 0 && user?.id) {
      loadCartFromSupabase(user.id).then((dbCart) => {
        if (dbCart.length > 0) setItems(dbCart);
      });
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    const path = user?.user_metadata?.profile_image_path;
    if (!path) return;
    supabase.storage
      .from("profile-pics")
      .createSignedUrl(path, 3600)
      .then(({ data, error }) => {
        if (error) {
          console.error(error.message);
          toast.error("Image load failed");
        } else {
          setImageUrl(data.signedUrl);
        }
      });
  }, [user?.user_metadata?.profile_image_path]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`id, status, total_amount, created_at, shipping_info, order_items (
    quantity, unit_price, product_id, products (name, image_url)
  )`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error.message);
        toast.error("Failed to fetch orders.");
      } else {
        setOrders(data);
      }
    };
    fetchOrders();
  }, [user?.id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);

    const ext = file.name.split(".").pop();
    const path = `profile-pics/${user.id}-${Date.now()}.${ext}`;



    const { error: uploadError } = await supabase.storage
      .from("profile-pics")
      .upload(path, file, { upsert: true });


    if (uploadError) {
      toast.error("Upload failed.");
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { profile_image_path: path },
    });

    if (updateError) {
      toast.error("Metadata update failed.");
      setIsLoading(false);
      return;
    }

    const { data: signed, error: signedError } = await supabase.storage
      .from("profile-pics")
      .createSignedUrl(path, 3600);

    if (signedError) {
      toast.error("Failed to fetch new image.");
    } else {
      setImageUrl(signed.signedUrl);
      toast.success("Profile image updated.");
    }

    setIsLoading(false);
  };

  const handleNameUpdate = async () => {
    if (name === user?.user_metadata?.name) return;
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: { name, full_name: name },
    });

    const { data: refreshedUser } = await supabase.auth.getUser();
    updateUser(refreshedUser?.user);

    if (error) toast.error("Failed to update name.");
    else {
      toast.success("Name updated.");
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 3000);
    }

    setIsLoading(false);
  };



  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? [] : [orderId]
    );
  };


  const selectAllOrders = () => setSelectedOrders(orders.map((order) => order.id));
  const clearSelectedOrders = () => setSelectedOrders([]);
  const toggleExpand = (id) => setExpandedOrderId((prev) => (prev === id ? null : id));

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const idMatch = order.id.toString().includes(searchTerm);
      const productMatch = order.order_items?.some((item) =>
        item.products?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return idMatch || productMatch;
    });
  }, [orders, searchTerm]);


  const handleClearOrderHistory = async () => {
    if (!user?.id) return toast.error("User not authenticated.");

    const confirm = window.confirm("This will archive all orders. Proceed?");
    if (!confirm) return;

    const { error } = await supabase
      .from("orders")
      .update({ archived: true })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to archive order history.");
    } else {
      setOrders([]);
      clearSelectedOrders();
      toast.success("Order history archived successfully.");
    }
  };


  const handleBulkCancel = async () => {
    if (!selectedOrders.length) return;
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "cancelled", deleted: true })
      .in("id", selectedOrders)
      .eq("user_id", user.id)
      .eq("archived", false);

    if (error) return toast.error("Bulk cancel failed.");
    toast.success("Selected orders cancelled.");
    setOrders((prev) =>
      prev.map((o) =>
        selectedOrders.includes(o.id) ? { ...o, status: "cancelled" } : o
      )
    );
    clearSelectedOrders();
  };
  const handleBulkDelete = async () => {
    if (!selectedOrders.length) return;
    const confirm = window.confirm("Delete selected orders? This action cannot be undone.");
    if (!confirm) return;

    const { error } = await supabase
      .from("orders")
      .update({ deleted: true })
      .in("id", selectedOrders)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to delete orders.");
    } else {
      toast.success("Orders deleted.");
      setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o.id)));
      clearSelectedOrders();
    }
  };

  const handleBulkContinue = () => {
    selectedOrders.forEach((orderId) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order || order.status === "cancelled") {
        toast.error(`Order ${orderId} is cancelled and cannot continue.`);
        return;
      }
      navigate("/checkout", { state: { orderId } });
    });
  };



  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-screen-md mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-xl"
        >

          <h1 className="text-3xl font-bold text-center mb-6">My Account</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger
                value="profile"
                className="radix-state-active:bg-primary radix-state-active:text-white"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="radix-state-active:bg-primary radix-state-active:text-white"
              >
                Order History
              </TabsTrigger>

            </TabsList>

            <TabsContent value="profile">
              <div className="grid sm:grid-cols-3 gap-6 items-start">
                {/* Profile Image Column */}
                <div className="flex flex-col items-center space-y-4">
                  <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                    {imageUrl ? (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={imageUrl}
                        alt="Profile"
                        className="w-28 h-28 object-cover border border-gray-300 shadow-md rounded-md"
                      />
                    ) : (
                      <div className="w-28 h-28 bg-gray-200 rounded-full" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                  <p className="text-sm text-gray-500 text-center">Click to change photo</p>
                </div>

                {/* Profile Form Column */}
                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                    <Button
                      onClick={handleNameUpdate}
                      disabled={isLoading}
                      className="mt-2 w-full sm:w-auto py-3 px-6 text-base"
                    >
                      {isLoading ? "Updating..." : "Save Changes"}
                    </Button>
                    {nameSaved && (
                      <p className="text-sm text-green-600 mt-1">Changes saved successfully ✅</p>
                    )}

                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
                      Logout
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="w-full sm:w-auto">
                          Forgot Password?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full sm:max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                          <DialogDescription>Enter your email to reset your password.</DialogDescription>
                        </DialogHeader>
                        <PasswordReset />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </TabsContent>


            <TabsContent value="orders" className="mt-4 px-2 sm:px-0">

              <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                <div>Total Orders: {totalOrders}</div>
                <div>Total Spent: {formatCurrency(totalSpent)}</div>
              </div>
              <BulkActions
                onSelectAll={selectAllOrders}
                onClear={clearSelectedOrders}
                onContinue={handleBulkContinue}
                onCancel={handleBulkCancel}
                onDelete={handleBulkDelete}
                disabled={!selectedOrders.length}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              {modalOrder && (
                <Dialog open={!!modalOrder} onOpenChange={(open) => !open && setModalOrder(null)}>
                  <DialogContent className="w-full sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                      <DialogDescription>
                        Details for Order ID: {modalOrder?.id}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-2 text-sm">
                      <p><strong>Status:</strong> {modalOrder.status}</p>
                      <p><strong>Total Amount:</strong> {formatCurrency(modalOrder.total_amount)}</p>
                      <p><strong>Date:</strong> {new Date(modalOrder.created_at).toLocaleString()}</p>
                      <div className="space-y-1">
                        {Object.entries(modalOrder.shipping_info).map(([key, val]) => (
                          <p key={key}><strong>{key}:</strong> {val}</p>
                        ))}
                      </div>


                      <div className="mt-2">
                        <h4 className="font-medium">Items:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {modalOrder.order_items.map((item) => (
                            <li key={item.product_id}>
                              {item.products?.name} – Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6 gap-2">
                      <Button
                        variant="secondary"
                        disabled={modalOrder.status === "cancelled"}
                        onClick={() => {
                          if (modalOrder.status === "cancelled") {
                            toast.error("Cannot continue a cancelled order.");
                          } else {
                            navigate("/checkout", { state: { orderId: modalOrder.id } });
                          }
                        }}
                      >
                        Continue
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={async () => {
                          const { error } = await supabase
                            .from("orders")
                            .update({ status: "cancelled" })
                            .eq("id", modalOrder.id);
                          if (error) return toast.error("Cancel failed.");
                          toast.success("Order cancelled.");
                          setOrders(prev =>
                            prev.map(o => o.id === modalOrder.id ? { ...o, status: "cancelled" } : o)
                          );
                          setModalOrder(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}


              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders found.</p>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="transition-transform duration-200 transform hover:scale-[1.01] hover:shadow-lg border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50 cursor-pointer"
                      onClick={() => setModalOrder(order)}
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleOrderSelection(order.id)}
                          />
                          <span className="text-sm font-medium break-all">
                            Order ID: {order.id}
                          </span>
                        </div>

                        <Badge variant={getBadgeVariant(order.status)} className="whitespace-nowrap">
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>


                      <div className="text-sm mt-1"><strong>Total:</strong> {formatCurrency(order.total_amount ?? 0)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                      {order.order_items?.map((item) => (
                        <div key={item.product_id} className="text-sm border-t mt-2 pt-2">
                          <p><strong>{item.products?.name}</strong></p>
                          <p>Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
