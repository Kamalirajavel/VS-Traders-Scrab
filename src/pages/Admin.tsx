import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MessageSquare, Tag, Package, FolderTree,
  Plus, Edit, Trash2, X, Save, Upload, Eye,
  AlertTriangle, Loader2, RefreshCw, ChevronRight, LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Section = "dashboard" | "categories" | "sub-categories" | "products" | "contact-requests";

// ── Types ───────────────────────────────────────────────────────
type Banner = {
  id: string; title: string; description: string | null;
  image_url: string | null; status: string; created_at: string;
};
type Category = { id: string; name: string; image_url: string | null; created_at: string; };
type SubCategory = { id: string; category_id: string; name: string; created_at: string; };
type Product = {
  id: string; category_id: string | null; sub_category_id: string | null;
  product_name: string; price_per_kg: number | null; description: string | null;
  image_url: string | null; created_at: string;
};
type ContactRequest = {
  id: string; name: string; phone: string; address: string;
  scrap_type: string; message: string | null; image_url: string | null; created_at: string;
};

// ── Helpers ─────────────────────────────────────────────────────
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const validateImage = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) return "Only JPEG, PNG, or WebP images are allowed.";
  if (file.size > 5 * 1024 * 1024) return "Image must be under 5MB.";
  return null;
};
const uploadImage = async (file: File, folder: string): Promise<string> => {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("scrap-images").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return supabase.storage.from("scrap-images").getPublicUrl(path).data.publicUrl;
};
const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ── UI Components ────────────────────────────────────────────────
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="relative z-10 bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface">
        <h3 className="text-foreground font-700 text-lg">{title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const DeleteConfirm = ({ label, onConfirm, onClose, loading }: {
  label: string; onConfirm: () => void; onClose: () => void; loading?: boolean;
}) => (
  <Modal title="Confirm Delete" onClose={onClose}>
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-destructive" />
      </div>
      <div>
        <p className="text-foreground font-600">Are you sure you want to delete</p>
        <p className="text-gold font-700 mt-1">"{label}"</p>
        <p className="text-muted-foreground text-sm mt-2">This action cannot be undone.</p>
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground transition-all">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 bg-destructive/10 border border-destructive/30 rounded-xl text-sm font-600 text-destructive hover:bg-destructive/20 transition-all flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Delete
        </button>
      </div>
    </div>
  </Modal>
);

const ImageUploadInput = ({ preview, onFileSelect, onClear, error, uploading }: {
  preview: string | null; onFileSelect: (f: File) => void; onClear: () => void;
  error?: string | null; uploading?: boolean;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <label className="text-muted-foreground text-xs font-600 uppercase tracking-widest block">Image</label>
      {preview ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-border group">
          <img src={preview} alt="preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => ref.current?.click()} className="px-3 py-2 bg-gold text-background text-xs font-700 rounded-lg flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Replace</button>
            <button type="button" onClick={onClear} className="px-3 py-2 bg-destructive/80 text-white text-xs font-700 rounded-lg flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Remove</button>
          </div>
          {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>}
        </div>
      ) : (
        <label className="bg-background border-2 border-dashed border-gold/40 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-gold transition-all">
          {uploading ? <Loader2 className="w-7 h-7 text-gold animate-spin" /> : <><Upload className="w-7 h-7 text-gold/60" /><span className="text-muted-foreground text-sm">Click to upload image</span><span className="text-muted-foreground text-xs">JPEG, PNG, WebP — max 5MB</span></>}
          <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelect(f); e.target.value = ""; }} />
        </label>
      )}
      {error && <p className="text-destructive text-xs font-600">{error}</p>}
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, required, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-muted-foreground text-xs font-600 uppercase tracking-widest block">{label}{required && " *"}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm transition-colors" />
  </div>
);

const SelectField = ({ label, value, onChange, children, required }: {
  label: string; value: string; onChange: (v: string) => void; children: React.ReactNode; required?: boolean;
}) => (
  <div className="space-y-1.5">
    <label className="text-muted-foreground text-xs font-600 uppercase tracking-widest block">{label}{required && " *"}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-gold text-sm transition-colors">
      {children}
    </select>
  </div>
);

const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto rounded-2xl border border-border">
    <table className="w-full text-sm">{children}</table>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left px-4 py-3 text-muted-foreground font-600 text-xs uppercase tracking-wider bg-surface border-b border-border">{children}</th>
);
const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 text-foreground text-sm border-b border-border/50 last:border-b-0">{children}</td>
);

const ActionBtns = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
  <div className="flex gap-1.5">
    <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
    <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
  </div>
);

// ── Main Component ───────────────────────────────────────────────
const Admin = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("dashboard");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; table: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Banners
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: "", description: "", status: "Active" });
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const [newBannerPreview, setNewBannerPreview] = useState<string | null>(null);
  const [newBannerFileError, setNewBannerFileError] = useState<string | null>(null);
  const [bannerSubmitting, setBannerSubmitting] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [editBannerFile, setEditBannerFile] = useState<File | null>(null);
  const [editBannerPreview, setEditBannerPreview] = useState<string | null>(null);
  const [editBannerUploading, setEditBannerUploading] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatFile, setNewCatFile] = useState<File | null>(null);
  const [newCatPreview, setNewCatPreview] = useState<string | null>(null);
  const [newCatFileError, setNewCatFileError] = useState<string | null>(null);
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [editCatFile, setEditCatFile] = useState<File | null>(null);
  const [editCatPreview, setEditCatPreview] = useState<string | null>(null);
  const [editCatUploading, setEditCatUploading] = useState(false);

  // Sub Categories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCatLoading, setSubCatLoading] = useState(false);
  const [showSubCatForm, setShowSubCatForm] = useState(false);
  const [newSubCat, setNewSubCat] = useState({ name: "", category_id: "" });
  const [subCatSubmitting, setSubCatSubmitting] = useState(false);
  const [editSubCat, setEditSubCat] = useState<SubCategory | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ product_name: "", category_id: "", sub_category_id: "", price_per_kg: "", description: "" });
  const [newProductFile, setNewProductFile] = useState<File | null>(null);
  const [newProductPreview, setNewProductPreview] = useState<string | null>(null);
  const [newProductFileError, setNewProductFileError] = useState<string | null>(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editProductFile, setEditProductFile] = useState<File | null>(null);
  const [editProductPreview, setEditProductPreview] = useState<string | null>(null);
  const [editProductUploading, setEditProductUploading] = useState(false);

  // Filter sub cats for product form
  const filteredSubCats = subCategories.filter(s => s.category_id === newProduct.category_id);
  const editFilteredSubCats = subCategories.filter(s => editProduct && s.category_id === editProduct.category_id);

  // Contact Requests
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [viewRequest, setViewRequest] = useState<ContactRequest | null>(null);

  // ── Fetch helpers ─────────────────────────────────────────────
  const fetchBanners = async () => {
    setBannersLoading(true);
    const { data } = await supabase.from("banners").select("*").order("created_at", { ascending: false });
    setBanners(data || []);
    setBannersLoading(false);
  };
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    const { data } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
    setCategories((data || []) as Category[]);
    setCategoriesLoading(false);
  };
  const fetchSubCategories = async () => {
    setSubCatLoading(true);
    const { data } = await supabase.from("sub_categories").select("*").order("created_at", { ascending: true });
    setSubCategories((data || []) as SubCategory[]);
    setSubCatLoading(false);
  };
  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data || []) as Product[]);
    setProductsLoading(false);
  };
  const fetchRequests = async () => {
    setRequestsLoading(true);
    const { data } = await supabase.from("contact_requests").select("*").order("created_at", { ascending: false });
    setRequests(data || []);
    setRequestsLoading(false);
  };

  useEffect(() => {
    // Always fetch categories + sub cats (needed in product dropdowns)
    fetchCategories();
    fetchSubCategories();
    if (section === "dashboard") { fetchProducts(); fetchRequests(); }
    if (section === "products") fetchProducts();
    if (section === "contact-requests") fetchRequests();
  }, [section]);

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await supabase.from(deleteTarget.table as any).delete().eq("id", deleteTarget.id);
    if (deleteTarget.table === "banners") setBanners(p => p.filter(x => x.id !== deleteTarget.id));
    if (deleteTarget.table === "categories") setCategories(p => p.filter(x => x.id !== deleteTarget.id));
    if (deleteTarget.table === "sub_categories") setSubCategories(p => p.filter(x => x.id !== deleteTarget.id));
    if (deleteTarget.table === "products") setProducts(p => p.filter(x => x.id !== deleteTarget.id));
    if (deleteTarget.table === "contact_requests") setRequests(p => p.filter(x => x.id !== deleteTarget.id));
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  // ── CRUD: Banners ─────────────────────────────────────────────
  const handleAddBanner = async () => {
    if (!newBanner.title) return;
    setBannerSubmitting(true);
    let image_url: string | null = null;
    if (newBannerFile) {
      try { image_url = await uploadImage(newBannerFile, "banners"); }
      catch (e: any) { setNewBannerFileError(e.message); setBannerSubmitting(false); return; }
    }
    const { data, error } = await supabase.from("banners").insert({ ...newBanner, image_url }).select().single();
    if (!error && data) {
      setBanners(p => [data, ...p]);
      setNewBanner({ title: "", description: "", status: "Active" });
      setNewBannerFile(null); setNewBannerPreview(null);
      setShowBannerForm(false);
    }
    setBannerSubmitting(false);
  };
  const handleSaveBanner = async () => {
    if (!editBanner) return;
    setEditBannerUploading(true);
    let image_url = editBanner.image_url;
    if (editBannerFile) {
      try { image_url = await uploadImage(editBannerFile, "banners"); }
      catch (e: any) { setEditBannerUploading(false); return; }
    }
    const { data, error } = await supabase.from("banners").update({ title: editBanner.title, description: editBanner.description, status: editBanner.status, image_url }).eq("id", editBanner.id).select().single();
    if (!error && data) setBanners(p => p.map(b => b.id === data.id ? data : b));
    setEditBannerFile(null); setEditBannerPreview(null);
    setEditBannerUploading(false);
    setEditBanner(null);
  };

  // ── CRUD: Categories ──────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setCatSubmitting(true);
    let image_url: string | null = null;
    if (newCatFile) {
      try { image_url = await uploadImage(newCatFile, "categories"); }
      catch (e: any) { setNewCatFileError(e.message); setCatSubmitting(false); return; }
    }
    const { data, error } = await supabase.from("categories").insert({ name: newCatName.trim(), image_url }).select().single();
    if (!error && data) {
      setCategories(p => [...p, data as Category]);
      setNewCatName(""); setNewCatFile(null); setNewCatPreview(null);
      setShowCatForm(false);
    }
    setCatSubmitting(false);
  };
  const handleSaveCategory = async () => {
    if (!editCat) return;
    setEditCatUploading(true);
    let image_url = editCat.image_url;
    if (editCatFile) {
      try { image_url = await uploadImage(editCatFile, "categories"); }
      catch (e: any) { setEditCatUploading(false); return; }
    }
    const { data, error } = await supabase.from("categories").update({ name: editCat.name, image_url }).eq("id", editCat.id).select().single();
    if (!error && data) setCategories(p => p.map(c => c.id === data.id ? data as Category : c));
    setEditCatFile(null); setEditCatPreview(null);
    setEditCatUploading(false);
    setEditCat(null);
  };

  // ── CRUD: Sub Categories ──────────────────────────────────────
  const handleAddSubCategory = async () => {
    if (!newSubCat.name.trim() || !newSubCat.category_id) return;
    setSubCatSubmitting(true);
    const { data, error } = await supabase.from("sub_categories").insert({ name: newSubCat.name.trim(), category_id: newSubCat.category_id }).select().single();
    if (!error && data) { setSubCategories(p => [...p, data as SubCategory]); setNewSubCat({ name: "", category_id: "" }); setShowSubCatForm(false); }
    setSubCatSubmitting(false);
  };
  const handleSaveSubCategory = async () => {
    if (!editSubCat) return;
    const { data, error } = await supabase.from("sub_categories").update({ name: editSubCat.name, category_id: editSubCat.category_id }).eq("id", editSubCat.id).select().single();
    if (!error && data) setSubCategories(p => p.map(s => s.id === data.id ? data as SubCategory : s));
    setEditSubCat(null);
  };

  // ── CRUD: Products ────────────────────────────────────────────
  const handleAddProduct = async () => {
    if (!newProduct.product_name.trim()) return;
    setProductSubmitting(true);
    let image_url: string | null = null;
    if (newProductFile) {
      try { image_url = await uploadImage(newProductFile, "products"); }
      catch (e: any) { setNewProductFileError(e.message); setProductSubmitting(false); return; }
    }
    const insertData = {
      product_name: newProduct.product_name.trim(),
      category_id: newProduct.category_id || null,
      sub_category_id: newProduct.sub_category_id || null,
      price_per_kg: newProduct.price_per_kg ? parseFloat(newProduct.price_per_kg) : null,
      description: newProduct.description || null,
      image_url,
    };
    const { data, error } = await supabase.from("products").insert(insertData).select().single();
    if (!error && data) {
      setProducts(p => [data as Product, ...p]);
      setNewProduct({ product_name: "", category_id: "", sub_category_id: "", price_per_kg: "", description: "" });
      setNewProductFile(null); setNewProductPreview(null);
      setShowProductForm(false);
    }
    setProductSubmitting(false);
  };
  const handleSaveProduct = async () => {
    if (!editProduct) return;
    setEditProductUploading(true);
    let image_url = editProduct.image_url;
    if (editProductFile) {
      try { image_url = await uploadImage(editProductFile, "products"); }
      catch (e: any) { setEditProductUploading(false); return; }
    }
    const { data, error } = await supabase.from("products").update({
      product_name: editProduct.product_name,
      category_id: editProduct.category_id,
      sub_category_id: editProduct.sub_category_id,
      price_per_kg: editProduct.price_per_kg,
      description: editProduct.description,
      image_url,
    }).eq("id", editProduct.id).select().single();
    if (!error && data) setProducts(p => p.map(x => x.id === data.id ? data as Product : x));
    setEditProductFile(null); setEditProductPreview(null);
    setEditProductUploading(false);
    setEditProduct(null);
  };

  const getCatName = (id: string | null) => categories.find(c => c.id === id)?.name ?? "—";
  const getSubCatName = (id: string | null) => subCategories.find(s => s.id === id)?.name ?? "—";

  const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "sub-categories", label: "Sub Categories", icon: FolderTree },
    { id: "products", label: "Products", icon: Package },
    { id: "contact-requests", label: "Contact Requests", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col min-h-screen fixed left-0 top-0 z-30">
        <div className="px-6 py-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center"><span className="text-background font-900 text-sm">VS</span></div>
            <div><p className="text-foreground font-700 text-sm">V.S Traders</p><p className="text-muted-foreground text-xs">Admin Panel</p></div>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSection(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-600 transition-all ${section === id ? "gradient-gold text-background shadow-gold" : "text-muted-foreground hover:text-foreground hover:bg-background"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 text-muted-foreground hover:text-foreground text-sm font-600 transition-colors rounded-xl hover:bg-background">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Site
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/admin-login", { replace: true });
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm font-600 transition-all rounded-xl"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8 min-h-screen">

        {/* ── DASHBOARD ── */}
        {section === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-800 text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Overview of your scrap management system.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Categories", value: categories.length, icon: Tag, onClick: () => setSection("categories") },
                { label: "Products", value: products.length, icon: Package, onClick: () => setSection("products") },
                { label: "Requests", value: requests.length, icon: MessageSquare, onClick: () => setSection("contact-requests") },
              ].map(s => (
                <button key={s.label} onClick={s.onClick} className="bg-surface border border-border rounded-2xl p-5 text-left hover:border-gold/50 hover:shadow-gold transition-all">
                  <s.icon className="w-5 h-5 text-gold mb-3" />
                  <p className="text-3xl font-800 text-foreground">{s.value}</p>
                  <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
                </button>
              ))}
            </div>
            {/* Recent requests */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-foreground font-700 mb-4">Recent Contact Requests</h2>
              {requestsLoading ? <Loader2 className="animate-spin text-gold w-5 h-5" /> : requests.slice(0, 5).length === 0 ? (
                <p className="text-muted-foreground text-sm">No requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {requests.slice(0, 5).map(r => (
                    <div key={r.id} className="flex items-center justify-between bg-background border border-border rounded-xl px-4 py-3">
                      <div>
                        <p className="text-foreground font-600 text-sm">{r.name} <span className="text-muted-foreground font-400">· {r.phone}</span></p>
                        <p className="text-muted-foreground text-xs mt-0.5">{r.scrap_type} · {fmt(r.created_at)}</p>
                      </div>
                      <button onClick={() => setViewRequest(r)} className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg"><Eye className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {section === "categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h1 className="text-3xl font-800 text-foreground">Categories</h1><p className="text-muted-foreground mt-1">Manage top-level scrap categories.</p></div>
              <button onClick={() => setShowCatForm(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90"><Plus className="w-4 h-4" /> Add Category</button>
            </div>

            {showCatForm && (
              <div className="bg-surface border border-gold/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-foreground font-700">New Category</h3>
                <InputField label="Category Name" value={newCatName} onChange={setNewCatName} required placeholder="e.g. Metal, Electronics, Appliances" />
                <ImageUploadInput
                  preview={newCatPreview}
                  onFileSelect={f => { const e = validateImage(f); setNewCatFileError(e); if (!e) { setNewCatFile(f); setNewCatPreview(URL.createObjectURL(f)); } }}
                  onClear={() => { setNewCatFile(null); setNewCatPreview(null); }}
                  error={newCatFileError}
                  uploading={catSubmitting && !!newCatFile}
                />
                <div className="flex gap-3">
                  <button onClick={handleAddCategory} disabled={catSubmitting || !newCatName.trim()} className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50">{catSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
                  <button onClick={() => { setShowCatForm(false); setNewCatFile(null); setNewCatPreview(null); }} className="px-5 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground">Cancel</button>
                </div>
              </div>
            )}

            {categoriesLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div> : (
              <TableWrapper>
                <thead><tr><Th>Image</Th><Th>Category Name</Th><Th>Sub Categories</Th><Th>Created</Th><Th>Actions</Th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                      <Td>
                        {c.image_url
                          ? <img src={c.image_url} alt={c.name} className="w-20 h-20 object-cover rounded-xl border border-border" />
                          : <div className="w-20 h-20 rounded-xl border border-border bg-muted flex items-center justify-center text-muted-foreground text-xs">No image</div>
                        }
                      </Td>
                      <Td><p className="font-600">{c.name}</p></Td>
                      <Td><span className="text-muted-foreground">{subCategories.filter(s => s.category_id === c.id).length}</span></Td>
                      <Td>{fmt(c.created_at)}</Td>
                      <Td><ActionBtns onEdit={() => { setEditCat(c); setEditCatPreview(c.image_url); }} onDelete={() => setDeleteTarget({ id: c.id, label: c.name, table: "categories" })} /></Td>
                    </tr>
                  ))}
                  {categories.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No categories yet.</td></tr>}
                </tbody>
              </TableWrapper>
            )}
          </div>
        )}

        {/* ── SUB CATEGORIES ── */}
        {section === "sub-categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h1 className="text-3xl font-800 text-foreground">Sub Categories</h1><p className="text-muted-foreground mt-1">Manage sub categories linked to categories.</p></div>
              <button onClick={() => setShowSubCatForm(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90"><Plus className="w-4 h-4" /> Add Sub Category</button>
            </div>

            {showSubCatForm && (
              <div className="bg-surface border border-gold/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-foreground font-700">New Sub Category</h3>
                <SelectField label="Category" value={newSubCat.category_id} onChange={v => setNewSubCat(p => ({ ...p, category_id: v }))} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </SelectField>
                <InputField label="Sub Category Name" value={newSubCat.name} onChange={v => setNewSubCat(p => ({ ...p, name: v }))} required placeholder="e.g. Copper, Aluminium, Iron" />
                <div className="flex gap-3">
                  <button onClick={handleAddSubCategory} disabled={subCatSubmitting || !newSubCat.name.trim() || !newSubCat.category_id} className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50">{subCatSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
                  <button onClick={() => setShowSubCatForm(false)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground">Cancel</button>
                </div>
              </div>
            )}

            {subCatLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div> : (
              <TableWrapper>
                <thead><tr><Th>Sub Category</Th><Th>Category</Th><Th>Created</Th><Th>Actions</Th></tr></thead>
                <tbody>
                  {subCategories.map(s => (
                    <tr key={s.id} className="hover:bg-surface/50 transition-colors">
                      <Td><p className="font-600">{s.name}</p></Td>
                      <Td><span className="px-2.5 py-1 bg-gold/10 border border-gold/20 text-gold text-xs font-600 rounded-lg">{getCatName(s.category_id)}</span></Td>
                      <Td>{fmt(s.created_at)}</Td>
                      <Td><ActionBtns onEdit={() => setEditSubCat(s)} onDelete={() => setDeleteTarget({ id: s.id, label: s.name, table: "sub_categories" })} /></Td>
                    </tr>
                  ))}
                  {subCategories.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-muted-foreground">No sub categories yet.</td></tr>}
                </tbody>
              </TableWrapper>
            )}
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {section === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h1 className="text-3xl font-800 text-foreground">Products</h1><p className="text-muted-foreground mt-1">Manage scrap products shown on homepage.</p></div>
              <button onClick={() => setShowProductForm(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90"><Plus className="w-4 h-4" /> Add Product</button>
            </div>

            {showProductForm && (
              <div className="bg-surface border border-gold/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-foreground font-700">New Product</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Product Name" value={newProduct.product_name} onChange={v => setNewProduct(p => ({ ...p, product_name: v }))} required placeholder="e.g. Copper Wire" />
                  <InputField label="Price per KG (₹)" value={newProduct.price_per_kg} onChange={v => setNewProduct(p => ({ ...p, price_per_kg: v }))} placeholder="e.g. 720" type="number" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField label="Category" value={newProduct.category_id} onChange={v => setNewProduct(p => ({ ...p, category_id: v, sub_category_id: "" }))}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </SelectField>
                  <SelectField label="Sub Category" value={newProduct.sub_category_id} onChange={v => setNewProduct(p => ({ ...p, sub_category_id: v }))}>
                    <option value="">Select sub category</option>
                    {filteredSubCats.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </SelectField>
                </div>
                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-600 uppercase tracking-widest block">Description</label>
                  <textarea value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Describe the product..." className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm resize-none" />
                </div>
                <ImageUploadInput preview={newProductPreview} onFileSelect={f => { const e = validateImage(f); setNewProductFileError(e); if (!e) { setNewProductFile(f); setNewProductPreview(URL.createObjectURL(f)); } }} onClear={() => { setNewProductFile(null); setNewProductPreview(null); }} error={newProductFileError} />
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAddProduct} disabled={productSubmitting || !newProduct.product_name.trim()} className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50">{productSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
                  <button onClick={() => setShowProductForm(false)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground">Cancel</button>
                </div>
              </div>
            )}

            {productsLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div> : (
              <TableWrapper>
                <thead><tr><Th>Image</Th><Th>Product</Th><Th>Category</Th><Th>Sub Category</Th><Th>Price/kg</Th><Th>Actions</Th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                      <Td>{p.image_url ? <img src={p.image_url} className="w-16 h-10 object-cover rounded-lg" /> : <div className="w-16 h-10 bg-muted rounded-lg" />}</Td>
                      <Td><p className="font-600">{p.product_name}</p>{p.description && <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{p.description}</p>}</Td>
                      <Td><span className="px-2.5 py-1 bg-gold/10 border border-gold/20 text-gold text-xs font-600 rounded-lg">{getCatName(p.category_id)}</span></Td>
                      <Td>{getSubCatName(p.sub_category_id)}</Td>
                      <Td>{p.price_per_kg != null ? <span className="text-gold font-700">₹{p.price_per_kg}</span> : <span className="text-muted-foreground">—</span>}</Td>
                      <Td><ActionBtns onEdit={() => { setEditProduct(p); setEditProductPreview(p.image_url); }} onDelete={() => setDeleteTarget({ id: p.id, label: p.product_name, table: "products" })} /></Td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No products yet.</td></tr>}
                </tbody>
              </TableWrapper>
            )}
          </div>
        )}

        {/* ── CONTACT REQUESTS ── */}
        {section === "contact-requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h1 className="text-3xl font-800 text-foreground">Contact Requests</h1><p className="text-muted-foreground mt-1">Customer pickup requests.</p></div>
              <button onClick={fetchRequests} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground transition-colors"><RefreshCw className="w-4 h-4" /> Refresh</button>
            </div>
            {requestsLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div> : (
              <TableWrapper>
                <thead><tr><Th>Name</Th><Th>Phone</Th><Th>Scrap Type</Th><Th>Address</Th><Th>Date</Th><Th>Actions</Th></tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                      <Td><p className="font-600">{r.name}</p></Td>
                      <Td>{r.phone}</Td>
                      <Td><span className="px-2.5 py-1 bg-gold/10 border border-gold/20 text-gold text-xs font-600 rounded-lg">{r.scrap_type}</span></Td>
                      <Td><p className="text-muted-foreground text-xs max-w-[180px] truncate">{r.address}</p></Td>
                      <Td>{fmt(r.created_at)}</Td>
                      <Td>
                        <div className="flex gap-1.5">
                          <button onClick={() => setViewRequest(r)} className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteTarget({ id: r.id, label: r.name, table: "contact_requests" })} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                  {requests.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No requests yet.</td></tr>}
                </tbody>
              </TableWrapper>
            )}
          </div>
        )}
      </main>

      {/* ── MODALS ── */}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm label={deleteTarget.label} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} loading={deleteLoading} />
      )}

      {/* View request */}
      {viewRequest && (
        <Modal title="Contact Request" onClose={() => setViewRequest(null)}>
          <div className="space-y-3">
            {[
              { label: "Name", value: viewRequest.name },
              { label: "Phone", value: viewRequest.phone },
              { label: "Scrap Type", value: viewRequest.scrap_type },
              { label: "Address", value: viewRequest.address },
              { label: "Message", value: viewRequest.message || "—" },
              { label: "Date", value: fmt(viewRequest.created_at) },
            ].map(f => (
              <div key={f.label} className="space-y-1">
                <p className="text-muted-foreground text-xs font-600 uppercase tracking-widest">{f.label}</p>
                <p className="text-foreground text-sm bg-background border border-border rounded-xl px-4 py-2.5">{f.value}</p>
              </div>
            ))}
            {viewRequest.image_url && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-600 uppercase tracking-widest">Image</p>
                <img src={viewRequest.image_url} className="w-full rounded-xl border border-border object-cover max-h-48" />
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Edit Banner Modal */}
      {editBanner && (
        <Modal title="Edit Banner" onClose={() => { setEditBanner(null); setEditBannerFile(null); setEditBannerPreview(null); }}>
          <div className="space-y-4">
            <InputField label="Title" value={editBanner.title} onChange={v => setEditBanner(p => p ? { ...p, title: v } : p)} required />
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-600 uppercase tracking-widest block">Description</label>
              <textarea value={editBanner.description || ""} onChange={e => setEditBanner(p => p ? { ...p, description: e.target.value } : p)} rows={2} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-gold text-sm resize-none" />
            </div>
            <SelectField label="Status" value={editBanner.status} onChange={v => setEditBanner(p => p ? { ...p, status: v } : p)}>
              <option value="Active">Active</option><option value="Inactive">Inactive</option>
            </SelectField>
            <ImageUploadInput preview={editBannerPreview || editBanner.image_url} onFileSelect={f => { setEditBannerFile(f); setEditBannerPreview(URL.createObjectURL(f)); }} onClear={() => { setEditBannerFile(null); setEditBannerPreview(null); setEditBanner(p => p ? { ...p, image_url: null } : p); }} uploading={editBannerUploading} />
            <div className="flex gap-3 pt-2">
              <button onClick={handleSaveBanner} disabled={editBannerUploading} className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50">{editBannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
              <button onClick={() => setEditBanner(null)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editCat && (
        <Modal title="Edit Category" onClose={() => { setEditCat(null); setEditCatFile(null); setEditCatPreview(null); }}>
          <div className="space-y-4">
            <InputField label="Category Name" value={editCat.name} onChange={v => setEditCat(p => p ? { ...p, name: v } : p)} required />
            <ImageUploadInput
              preview={editCatPreview || editCat.image_url}
              onFileSelect={f => { setEditCatFile(f); setEditCatPreview(URL.createObjectURL(f)); }}
              onClear={() => { setEditCatFile(null); setEditCatPreview(null); setEditCat(p => p ? { ...p, image_url: null } : p); }}
              uploading={editCatUploading}
            />
            <div className="flex gap-3">
              <button onClick={handleSaveCategory} disabled={editCatUploading} className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50">{editCatUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
              <button onClick={() => { setEditCat(null); setEditCatFile(null); setEditCatPreview(null); }} className="px-5 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        </Modal>
      )}


      {/* Edit Sub Category Modal */}
      {editSubCat && (
        <Modal title="Edit Sub Category" onClose={() => setEditSubCat(null)}>
          <div className="space-y-4">
            <SelectField label="Category" value={editSubCat.category_id} onChange={v => setEditSubCat(p => p ? { ...p, category_id: v } : p)} required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </SelectField>
            <InputField label="Sub Category Name" value={editSubCat.name} onChange={v => setEditSubCat(p => p ? { ...p, name: v } : p)} required />
            <div className="flex gap-3">
              <button onClick={handleSaveSubCategory} className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90"><Save className="w-4 h-4" /> Save</button>
              <button onClick={() => setEditSubCat(null)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <Modal title="Edit Product" onClose={() => { setEditProduct(null); setEditProductFile(null); setEditProductPreview(null); }}>
          <div className="space-y-4">
            <InputField label="Product Name" value={editProduct.product_name} onChange={v => setEditProduct(p => p ? { ...p, product_name: v } : p)} required />
            <InputField label="Price per KG (₹)" value={editProduct.price_per_kg?.toString() ?? ""} onChange={v => setEditProduct(p => p ? { ...p, price_per_kg: v ? parseFloat(v) : null } : p)} type="number" />
            <SelectField label="Category" value={editProduct.category_id ?? ""} onChange={v => setEditProduct(p => p ? { ...p, category_id: v, sub_category_id: null } : p)}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </SelectField>
            <SelectField label="Sub Category" value={editProduct.sub_category_id ?? ""} onChange={v => setEditProduct(p => p ? { ...p, sub_category_id: v || null } : p)}>
              <option value="">Select sub category</option>
              {editFilteredSubCats.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </SelectField>
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-600 uppercase tracking-widest block">Description</label>
              <textarea value={editProduct.description || ""} onChange={e => setEditProduct(p => p ? { ...p, description: e.target.value } : p)} rows={2} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-gold text-sm resize-none" />
            </div>
            <ImageUploadInput preview={editProductPreview || editProduct.image_url} onFileSelect={f => { setEditProductFile(f); setEditProductPreview(URL.createObjectURL(f)); }} onClear={() => { setEditProductFile(null); setEditProductPreview(null); setEditProduct(p => p ? { ...p, image_url: null } : p); }} uploading={editProductUploading} />
            <div className="flex gap-3 pt-2">
              <button onClick={handleSaveProduct} disabled={editProductUploading} className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-background text-sm font-700 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50">{editProductUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
              <button onClick={() => setEditProduct(null)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
