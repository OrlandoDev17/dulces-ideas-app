import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getVenezuelaTime } from "@/services/FechaYHora";

export const useTasaBCV = () => {
  const [tasa, setTasa] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  const fetchTasa = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://ve.dolarapi.com/v1/dolares/oficial");
      const valorTasa = res.data.promedio;
      setTasa(valorTasa);
      setUltimaActualizacion(getVenezuelaTime().toLocaleTimeString());
    } catch (error) {
      console.error("Error al obtener la tasa:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasa();
  }, [fetchTasa]);

  return {
    tasa,
    setTasa,
    loading,
    editando,
    setEditando,
    ultimaActualizacion,
    fetchTasa,
  };
};
