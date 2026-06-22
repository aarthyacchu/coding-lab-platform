#!/usr/bin/env python3
"""Check DICE API parameters"""

import dice_ml
import inspect

print("=" * 80)
print("DICE-ML API INVESTIGATION")
print("=" * 80)
print(f"\nVersion: 0.12")

# Check the main generate_counterfactuals signature
print("\n1. Dice.generate_counterfactuals() signature:")
print("-" * 80)
sig = inspect.signature(dice_ml.Dice.generate_counterfactuals)
for param_name, param in sig.parameters.items():
    default = param.default
    if default == inspect.Parameter.empty:
        default = "(required)"
    print(f"  {param_name}: {default}")

# Try to instantiate and check methods
print("\n2. Checking available parameters in help:")
print("-" * 80)
help(dice_ml.Dice.generate_counterfactuals)
