// ════════════════════════════════════════════
// Unit conversion helpers for investment quantities
// ════════════════════════════════════════════

export interface UnitOption {
  value: string;
  label: string;
  /** Multiplier to convert FROM this unit TO the base unit.
   *  qty_in_base = qty_in_this_unit × toBase
   */
  toBase: number;
}

/**
 * Conversion table per base unit.
 * Key = the base unit (asset's native unit), value = array of selectable units.
 * The first entry in each array should always be the base unit itself (toBase = 1).
 */
const UNIT_CONVERSIONS: Record<string, UnitOption[]> = {
  "troy oz": [
    { value: "troy oz", label: "Troy Ounce (ozt)", toBase: 1 },
    { value: "gram", label: "Gram (g)", toBase: 1 / 31.1035 },
    { value: "kg", label: "Kilogram (kg)", toBase: 1000 / 31.1035 },
  ],
  gram: [
    { value: "gram", label: "Gram (g)", toBase: 1 },
    { value: "kg", label: "Kilogram (kg)", toBase: 1000 },
    { value: "troy oz", label: "Troy Ounce (ozt)", toBase: 31.1035 },
  ],
  kg: [
    { value: "kg", label: "Kilogram (kg)", toBase: 1 },
    { value: "gram", label: "Gram (g)", toBase: 0.001 },
    { value: "troy oz", label: "Troy Ounce (ozt)", toBase: 0.0311035 },
  ],
  BTC: [
    { value: "BTC", label: "Bitcoin (BTC)", toBase: 1 },
    { value: "mBTC", label: "Milli-Bitcoin (mBTC)", toBase: 0.001 },
    { value: "sat", label: "Satoshi (sat)", toBase: 0.00000001 },
  ],
  ETH: [
    { value: "ETH", label: "Ether (ETH)", toBase: 1 },
    { value: "Gwei", label: "Gwei", toBase: 0.000000001 },
  ],
};

/**
 * Get available unit options for a given base unit.
 * Returns at least the base unit itself as the only option.
 */
export function getUnitOptions(
  baseUnit: string | null | undefined,
): UnitOption[] {
  if (!baseUnit) return [{ value: "unit", label: "Unit", toBase: 1 }];
  return (
    UNIT_CONVERSIONS[baseUnit] ?? [
      { value: baseUnit, label: baseUnit, toBase: 1 },
    ]
  );
}

/**
 * Convert a quantity from a selected unit to the asset's base unit.
 */
export function convertToBaseUnit(
  quantity: number,
  selectedUnit: string,
  baseUnit: string | null | undefined,
): number {
  const options = getUnitOptions(baseUnit);
  const opt = options.find((o) => o.value === selectedUnit);
  return quantity * (opt?.toBase ?? 1);
}

/**
 * Convert a quantity from the asset's base unit to a selected unit.
 */
export function convertFromBaseUnit(
  quantity: number,
  selectedUnit: string,
  baseUnit: string | null | undefined,
): number {
  const options = getUnitOptions(baseUnit);
  const opt = options.find((o) => o.value === selectedUnit);
  const toBase = opt?.toBase ?? 1;
  return toBase !== 0 ? quantity / toBase : 0;
}

/**
 * Generate a human-readable conversion info string.
 * e.g. "1 troy oz = 31.1035 gram"
 */
export function getConversionInfo(
  selectedUnit: string,
  baseUnit: string | null | undefined,
): string | null {
  if (!baseUnit || selectedUnit === baseUnit) return null;

  const options = getUnitOptions(baseUnit);
  const opt = options.find((o) => o.value === selectedUnit);
  if (!opt) return null;

  const toBase = opt.toBase;
  if (toBase === 1) return null;

  // Show "1 selectedUnit = X baseUnit"
  const baseQty = toBase;
  // Format to reasonable precision
  const fmt =
    baseQty >= 1
      ? baseQty.toLocaleString("en", { maximumFractionDigits: 6 })
      : baseQty.toLocaleString("en", { maximumSignificantDigits: 6 });

  return `1 ${selectedUnit} = ${fmt} ${baseUnit}`;
}
