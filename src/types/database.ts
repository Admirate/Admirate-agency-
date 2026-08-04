export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: string;
          company: string | null;
          services: string[];
          budget: string | null;
          timeline: string | null;
          industry: string | null;
          plan: string | null;
          billing_cycle: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          status?: string;
          company?: string | null;
          services?: string[];
          budget?: string | null;
          timeline?: string | null;
          industry?: string | null;
          plan?: string | null;
          billing_cycle?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          status?: string;
          company?: string | null;
          services?: string[];
          budget?: string | null;
          timeline?: string | null;
          industry?: string | null;
          plan?: string | null;
          billing_cycle?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      email_recipients: {
        Row: {
          id: string;
          email: string;
          name: string;
          active: boolean;
          /** An id from src/lib/industries.ts. Null means Unassigned. */
          industry: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          active?: boolean;
          industry?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          active?: boolean;
          industry?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      email_drafts: {
        Row: {
          id: string;
          subject: string;
          body: string;
          status: "draft" | "sent" | "scheduled";
          /** A template id from src/components/email/templates. Null is the default. */
          template_id: string | null;
          /** Industry ids to send to. Empty means everyone active. */
          industries: string[];
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject: string;
          body: string;
          status?: "draft" | "sent" | "scheduled";
          template_id?: string | null;
          industries?: string[];
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject?: string;
          body?: string;
          status?: "draft" | "sent" | "scheduled";
          template_id?: string | null;
          industries?: string[];
          sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string;
          external_url: string;
          tags: string[];
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url: string;
          external_url: string;
          tags: string[];
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string;
          external_url?: string;
          tags?: string[];
          order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      pricing_currencies: {
        Row: {
          code: string;
          symbol: string;
          countries: string[];
          authored: boolean;
          rate: number | null;
          rate_updated_at: string | null;
          round_to: number;
          /** Fraction, e.g. 0.18. Null means no rate is claimed — not zero. */
          tax_rate: number | null;
          tax_label: string | null;
          active: boolean;
          sort_order: number;
        };
        Insert: {
          code: string;
          symbol: string;
          countries?: string[];
          authored?: boolean;
          rate?: number | null;
          rate_updated_at?: string | null;
          round_to?: number;
          tax_rate?: number | null;
          tax_label?: string | null;
          active?: boolean;
          sort_order?: number;
        };
        Update: {
          code?: string;
          symbol?: string;
          countries?: string[];
          authored?: boolean;
          rate?: number | null;
          rate_updated_at?: string | null;
          round_to?: number;
          tax_rate?: number | null;
          tax_label?: string | null;
          active?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      pricing_plans: {
        Row: {
          id: string;
          family: "retainer" | "website" | "care";
          slug: string;
          name: string;
          blurb: string;
          tier_order: number;
          featured: boolean;
          price_type: "recurring" | "one_time";
        };
        Insert: {
          id?: string;
          family: "retainer" | "website" | "care";
          slug: string;
          name: string;
          blurb?: string;
          tier_order?: number;
          featured?: boolean;
          price_type: "recurring" | "one_time";
        };
        Update: {
          id?: string;
          family?: "retainer" | "website" | "care";
          slug?: string;
          name?: string;
          blurb?: string;
          tier_order?: number;
          featured?: boolean;
          price_type?: "recurring" | "one_time";
        };
        Relationships: [];
      };
      pricing_amounts: {
        Row: {
          plan_id: string;
          currency_code: string;
          /** Monthly base for recurring plans; the price for one-time plans. */
          amount: number;
        };
        Insert: {
          plan_id: string;
          currency_code: string;
          amount: number;
        };
        Update: {
          plan_id?: string;
          currency_code?: string;
          amount?: number;
        };
        Relationships: [];
      };
      pricing_features: {
        Row: {
          id: string;
          family: "retainer" | "website" | "care";
          label: string;
          row_order: number;
          /** Plan slug to cell value. "✓" and "—" are symbols; else literal. */
          values: Record<string, string>;
        };
        Insert: {
          id?: string;
          family: "retainer" | "website" | "care";
          label: string;
          row_order?: number;
          values?: Record<string, string>;
        };
        Update: {
          id?: string;
          family?: "retainer" | "website" | "care";
          label?: string;
          row_order?: number;
          values?: Record<string, string>;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
