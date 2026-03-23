export const env = {
  shelbyApiKey: import.meta.env.VITE_SHELBY_API_KEY as string | undefined,
  aptosTestnetApiKey: import.meta.env
    .VITE_APTOS_TESTNET_API_KEY as string | undefined,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};

