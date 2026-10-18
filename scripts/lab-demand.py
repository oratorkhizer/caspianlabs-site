#!/usr/bin/env python3
"""Rank the WhatsApp catalog by what the lab actually runs.

Input: Crelio "Day Wise Test Report" xlsx exports (Reports > Day Wise Test Report), any number of months.
Output: api/_demand.js  -> DEMAND = { slug: {pm, pm3, score} }, read by api/whatsapp-catalog.js.

    python3 scripts/lab-demand.py path/to/*Day_Wise_Test_Report*.xlsx

Counts only standalone orders (rows with no Profile Name): a test bundled inside a package is not
something a patient picks from the catalog. Packages appear as their own rows, so they count too.
pm  = orders per month over the whole period; pm3 = orders per month over the last 3 months.
score = 0.3 x pm + 0.7 x pm3, so a rising test climbs fast and a dying one falls. The feed shows an item only
if pm or pm3 is at least 1 (or the slug is in PIN in api/whatsapp-catalog.js), busiest first.
Patient names and phones in the exports are never written anywhere; only counts leave this script.
"""
import glob, json, re, sys
import pandas as pd

import os
M = json.load(open(os.path.join(os.path.dirname(__file__), 'demand-map.json')))  # slug -> Crelio test-name regex, shared with crelio-demand.mjs

def load(paths):
    out = []
    for f in paths:
        d = pd.read_excel(f)
        d.columns = [re.sub(r'\s*\(Total\)$', '', str(c)).strip() for c in d.columns]
        d = d[d['Bill Date'].notna()][['Bill Date', 'Test Name', 'Profile Name', 'Organisation']].copy()
        out.append(d)
    A = pd.concat(out, ignore_index=True)
    A['date'] = pd.to_datetime(A['Bill Date'], format='%d/%m/%Y', errors='coerce')
    A = A[A.date.notna() & (A['Organisation'].fillna('').astype(str).str.strip() != 'Demo org test')]
    pkg = A['Profile Name'].fillna('').astype(str).str.strip()
    return A[pkg.isin(['', 'nan', 'None', '-'])]

def main(paths):
    A = load(paths)
    end = A.date.max()
    months = max((end - A.date.min()).days / 30.44, 1)
    recent = A.date > end - pd.Timedelta(days=91)
    out = {}
    for slug, pat in M.items():
        m = A['Test Name'].astype(str).str.contains(pat, case=False, regex=True)
        pm = round(m.sum() / months, 1)
        pm3 = round((m & recent).sum() / 3, 1)
        out[slug] = {'pm': pm, 'pm3': pm3, 'score': round(0.3 * pm + 0.7 * pm3, 1)}
    head = ('// Written by scripts/lab-demand.py from Crelio Day Wise Test Reports. Do not edit by hand.\n'
            f'// Period: {A.date.min():%d %b %Y} to {end:%d %b %Y}. pm = standalone orders per month, pm3 = last 3 months.\n')
    body = 'export const DEMAND_PERIOD = ' + json.dumps(f'{A.date.min():%Y-%m-%d}..{end:%Y-%m-%d}') + ';\n'
    body += 'export const DEMAND = ' + json.dumps(out, indent=1) + ';\n'
    open('api/_demand.js', 'w').write(head + body)
    for s, v in sorted(out.items(), key=lambda kv: -kv[1]['score']):
        print(f"{s:45s} {v['pm']:7} {v['pm3']:7} {v['score']:7}")

if __name__ == '__main__':
    paths = [p for a in sys.argv[1:] for p in glob.glob(a)]
    if not paths: sys.exit('usage: lab-demand.py <crelio xlsx files>')
    main(paths)
