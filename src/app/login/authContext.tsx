import { useState } from "react";

// authContext.tsx
const [user, setUser] = useState<{ rol: string } | null>(null);
