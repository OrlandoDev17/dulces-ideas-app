import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getVenezuelaTime } from "@/services/FechaYHora";

export const useTasaBCV = () => {
  const [tasa, setTasa] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  // Cargar tasa guardada al iniciar (solo en el cliente)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTasa = localStorage.getItem("manual_tasa");
      const savedTime = localStorage.getItem("manual_tasa_time");
      if (savedTasa) {
        setTasa(parseFloat(savedTasa));
        if (savedTime) setUltimaActualizacion(savedTime);
      }
    }
  }, []);

  const fetchTasa = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://ve.dolarapi.com/v1/dolares/oficial");
      const valorTasa = res.data.promedio;
      setTasa(valorTasa);
      const timeStr = getVenezuelaTime().toLocaleTimeString();
      setUltimaActualizacion(timeStr);

      // Al recargar el valor, podemos limpiar la manual (o dejarla, pero el usuario dijo "se guarde HASTA que se recargue")
      if (typeof window !== "undefined") {
        localStorage.removeItem("manual_tasa");
        localStorage.removeItem("manual_tasa_time");
      }
    } catch (error) {
      console.error("Error al obtener la tasa:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTasaManualmente = (nuevaTasa: number) => {
    setTasa(nuevaTasa);
    if (typeof window !== "undefined") {
      localStorage.setItem("manual_tasa", nuevaTasa.toString());
      const timeStr = `Manual - ${getVenezuelaTime().toLocaleTimeString()}`;
      setUltimaActualizacion(timeStr);
      localStorage.setItem("manual_tasa_time", timeStr);
    }
  };

  useEffect(() => {
    // Solo fetch si no hay una tasa manual guardada ya cargada
    if (typeof window !== "undefined" && !localStorage.getItem("manual_tasa")) {
      fetchTasa();
    }
  }, [fetchTasa]);

  return {
    tasa,
    setTasa: updateTasaManualmente,
    loading,
    editando,
    setEditando,
    ultimaActualizacion,
    fetchTasa,
  };
};
