/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, DonutChart, List, ListItem } from "@tremor/react";

// Colores que combinan con tu estética Neumorphic
const valueFormatter = (number: number) =>
  `Bs. ${new Intl.NumberFormat("es-VE").format(number)}`;

export function PaymentMethodsCard({ data, totalVentas }: any) {
  return (
    <Card className="col-start-1 row-start-3 col-span-2 row-span-1 rounded-4xl border-none shadow-bento p-8 bg-white flex flex-col items-center">
      <h3 className="text-zinc-500 text-sm font-black self-start mb-8 uppercase tracking-widest">
        Métodos de Pago
      </h3>

      <div className="relative flex items-center justify-center w-full">
        <DonutChart
          className="h-56"
          data={data}
          category="value"
          index="name"
          valueFormatter={valueFormatter}
          colors={["emerald", "amber", "orange", "stone"]} // Colores para diferenciar métodos
          showLabel={false}
          variant="donut"
        />
        {/* El número central de transacciones */}
        <div className="absolute flex flex-col items-center pointer-events-none">
          <p className="text-4xl font-black text-zinc-900 leading-none">
            {totalVentas}
          </p>
          <p className="text-[10px] font-black text-zinc-400 uppercase mt-1 tracking-tighter">
            Ventas Totales
          </p>
        </div>
      </div>

      {/* Leyenda personalizada para mayor control visual */}
      <List className="mt-8 w-full">
        {data.map((item: any) => (
          <ListItem key={item.name} className="py-2">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-current" />
              <span className="text-xs font-bold text-zinc-600 uppercase">
                {item.name}
              </span>
            </div>
            <span className="text-xs font-black text-zinc-900">
              {valueFormatter(item.value)}
            </span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
