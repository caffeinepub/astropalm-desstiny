import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, ClipboardList, Loader2, ShieldAlert, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCheckAdmin, useGetAllInquiries } from "../hooks/useQueries";
import BlogManagementTab from "./BlogManagementTab";
import InquiriesTab from "./InquiriesTab";

interface AdminDashboardProps {
  onClose: () => void;
}

function InquiryNotificationPopup({
  count,
  onViewInquiries,
  onDismiss,
}: {
  count: number;
  onViewInquiries: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gold/20 max-w-sm w-full p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <Bell size={28} className="text-gold-dark" />
        </div>
        <h2 className="font-serif text-xl font-semibold text-charcoal mb-1">
          {count > 0
            ? `You have ${count} ${count === 1 ? "inquiry" : "inquiries"}`
            : "No inquiries yet"}
        </h2>
        <p className="text-sm text-charcoal/55 mb-6">
          {count > 0
            ? "Visitor inquiries and booking requests are waiting in your dashboard."
            : "No visitor submissions yet. Check back later."}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {count > 0 && (
            <button
              type="button"
              onClick={onViewInquiries}
              className="btn-gold flex items-center justify-center gap-2 text-sm px-5 py-2"
              data-ocid="admin.view_inquiries.button"
            >
              <ClipboardList size={15} />
              View Inquiries
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            className="btn-outline-gold text-sm px-5 py-2"
            data-ocid="admin.dismiss.button"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useCheckAdmin();
  const { data: inquiries } = useGetAllInquiries();
  const [activeTab, setActiveTab] = useState("inquiries");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isAdmin && inquiries !== undefined) {
      setShowPopup(true);
    }
  }, [isAdmin, inquiries]);

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-bg pt-20">
        <div className="text-center">
          <ShieldAlert size={48} className="text-gold/40 mx-auto mb-4" />
          <p className="font-serif text-xl text-charcoal/60">
            Please log in to access the dashboard
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 btn-outline-gold text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-bg pt-20">
        <Loader2 size={32} className="animate-spin text-gold/60" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-bg pt-20">
        <div className="text-center">
          <ShieldAlert size={48} className="text-destructive/40 mx-auto mb-4" />
          <p className="font-serif text-xl text-charcoal/60">Access Denied</p>
          <p className="text-sm text-charcoal/40 mt-1">
            You do not have admin privileges.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 btn-outline-gold text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const inquiryCount = inquiries?.length ?? 0;

  return (
    <div className="min-h-screen bg-cream-bg pt-20">
      {showPopup && (
        <InquiryNotificationPopup
          count={inquiryCount}
          onViewInquiries={() => {
            setActiveTab("inquiries");
            setShowPopup(false);
          }}
          onDismiss={() => setShowPopup(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-charcoal">
              Admin Dashboard
            </h1>
            <p className="text-sm text-charcoal/50 mt-1">
              Manage inquiries and blog posts
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 btn-outline-gold text-sm"
            data-ocid="admin.close.button"
          >
            <X size={14} />
            Close Dashboard
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gold/10 border border-gold/20 mb-6">
            <TabsTrigger
              value="inquiries"
              className="data-[state=active]:bg-gold data-[state=active]:text-white"
              data-ocid="admin.inquiries.tab"
            >
              Inquiries
              {inquiryCount > 0 && (
                <span className="ml-1.5 bg-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {inquiryCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              className="data-[state=active]:bg-gold data-[state=active]:text-white"
              data-ocid="admin.blog.tab"
            >
              Blog Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            <InquiriesTab />
          </TabsContent>
          <TabsContent value="blog">
            <BlogManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
