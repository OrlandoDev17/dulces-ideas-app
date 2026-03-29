import { supabase } from "@/shared/config/supabase";

export const storesApi = {
  async validatePasscode(passcode: string) {
    const { data, error } = await supabase
      .from("store")
      .select("id, name, is_demo")
      .eq("passcode", passcode)
      .single();

    if (error) {
      if (error.code === "PGRST116") throw new Error("PIN incorrecto");
      throw error;
    }

    return data;
  },
};
