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
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          status?: string;
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
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          active?: boolean;
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
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject: string;
          body: string;
          status?: "draft" | "sent" | "scheduled";
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject?: string;
          body?: string;
          status?: "draft" | "sent" | "scheduled";
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
