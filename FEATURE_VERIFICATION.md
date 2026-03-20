# 🎯 Quick Feature Verification Cheat Sheet

## 📊 Dashboard Tab — View All Metrics

```
┌─────────────────────────────────────────────────────────┐
│                  📊 DASHBOARD TAB                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [📦 Total Items]  [⏰ Expiring Soon]  [📉 Low Stock]   │
│        15                  3                 2           │
│                                                          │
│  [♻️ Sustainability]  [❌ Expired]                       │
│      82%                    1                            │
│                                                          │
│  ┌─ ⏰ Expiring Soonest ─┐  ┌─ 📉 Low Stock Items ─┐   │
│  │ 1. Milk (tomorrow)   │  │ 1. Coffee (3/10)    │   │
│  │ 2. Yogurt (in 5d)    │  │ 2. Sugar (5/15)     │   │
│  └──────────────────────┘  └─────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Test Checklist:
- [ ] All 5 metric cards display
- [ ] Numbers update when items added/deleted
- [ ] Top items lists show correctly
- [ ] Handles empty inventory gracefully

---

## 📦 Inventory Tab — Manage Items

```
┌────────────────────────────────────────────────────────────┐
│              📦 INVENTORY MANAGEMENT                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  [➕ Add Item Button]  [Search Box]  [Category ▼] [Status ▼]
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📦 Item Name │ Category │ Qty │ Unit │ Expiry │ Status│
│  ├─────────────────────────────────────────────────────┤   │
│  │ Coffee       │ Perishable│ 50 │ kg  │ 2025-05│✅ OK   │   │
│  │ Milk         │ Perishable│ 8  │ L   │ 2025-03│📉 Low  │   │
│  │ Expired Tea  │ Beverage  │ 2  │ kg  │ 2024-05│❌ Exp  │   │
│  │              │           │    │     │       │ Actions│   │
│  │              │           │    │     │       │✏️📋🗑️  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Showing 3 of 3 items             [🔄 Refresh]           │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Test Checklist:
- [ ] **Add Item:** Click ➕, fill form, AI auto-fills, item appears
- [ ] **Search:** Type name, table filters instantly
- [ ] **Filter:** Select category/status, updates immediately
- [ ] **Edit:** Click ✏️, modal shows, changes save
- [ ] **Delete:** Click 🗑️, confirm, item removed
- [ ] **Sort:** Click column headers, items reorder
- [ ] **Status Badges:** Colors match item status (🟢 🟡 🟠 🔴)

---

## 🤖 AI Insights Tab — Get Smart Recommendations

```
┌────────────────────────────────────────────────────────────┐
│                   🤖 AI INSIGHTS                           │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ 🤖 Powered by AI ─────────────────────────────────┐   │
│  │                                                     │   │
│  │ Inventory Risk Report:                              │   │
│  │                                                     │   │
│  │ • Items expiring within 7 days: 3                  │   │
│  │   → Immediate action needed for Milk, Yogurt      │   │
│  │                                                     │   │
│  │ • Items below reorder threshold: 2                 │   │
│  │   → Coffee stock critically low (3/10 units)      │   │
│  │                                                     │   │
│  │ Top Recommendations:                                │   │
│  │ 1. Use expiring items first (FIFO strategy)        │   │
│  │ 2. Reorder coffee immediately from local supplier │   │
│  │ 3. Consider sustainable packaging for milk        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  OR IF FALLBACK (Blue badge):                              │
│  ┌─ 📋 Fallback Mode ─────────────────────────────────┐   │
│  │ (API unavailable, using rule-based analysis)       │   │
│  │ [Same metrics but without AI recommendations]      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Test Checklist:
- [ ] **AI Works:** Report generated, source = "ai", green badge
- [ ] **Fallback Works:** If API invalid, source = "fallback", blue badge
- [ ] **Content Accurate:** Metrics match inventory (expiring count, low stock count)
- [ ] **Recommendations Helpful:** Suggestions are actionable

---

## ➕ Add Item Form — Create New Inventory Items

```
ADD ITEM FORM:
┌─────────────────────────────────────────┐
│ Add New Item                            │
├─────────────────────────────────────────┤
│ Item Name: [_______________] (required) │
│ Category:  [Perishable    ▼]            │
│ Quantity:  [_______________] (required) │
│ Unit:      [kg            ▼]            │
│ Purchase:  [YYYY-MM-DD     ]            │
│ Expiry:    [YYYY-MM-DD     ]            │
│ Reorder:   [_____] units                │
│ Supplier:  [_______________]            │
│ Notes:     [_____________________]      │
│                                          │
│ [💡 AI Auto-Fill]  [✓ Add Item]       │
│                                          │
│ Status: "✨ Suggested by AI" (green)   │
│    OR  "Field required" (red error)    │
└─────────────────────────────────────────┘
```

### Test Checklist:
- [ ] **AI Auto-Fill Works:** Click button, category/unit/threshold populate
- [ ] **AI Fallback:** If API fails, use defaults (Office Supply, pcs, 10)
- [ ] **Validation:** Empty/invalid fields show error messages
- [ ] **Submit Success:** Item appears in table immediately
- [ ] **Date Validation:** Expiry can't be before purchase date

---

## 🔍 Search & Filter

```
SEARCH BAR:
┌─ Search: [Coffee____________]  Search updates live
└─ Shows: "Showing X of Y items"

CATEGORY FILTER:
┌─ Category: [Perishable    ▼]
│  Options:
│  • Perishable
│  • Equipment
│  • Chemical
│  • Office Supply
│  • All Items
└─ Updates: Immediate ⚡

STATUS FILTER:
┌─ Status: [OK            ▼]
│  Options:
│  • OK ✅ (healthy)
│  • Expiring Soon ⏰ (7 days)
│  • Low Stock 📉 (under threshold)
│  • Expired ❌ (past date)
│  • All Items
└─ Updates: Immediate ⚡

COMBINED FILTERS:
Search "Milk" + Category "Perishable" + Status "Expiring Soon"
= Shows only Milk items that are perishable AND expiring
```

### Test Checklist:
- [ ] Search works (type, see results filter)
- [ ] Category filter works
- [ ] Status filter works
- [ ] Combination of filters works
- [ ] Clear search/filter shows all items

---

## ✏️ Edit Item

```
CLICK EDIT ➜ MODAL APPEARS:

┌─────────────────────────────┐
│ Edit Item                   │
├─────────────────────────────┤
│ Name: [Coffee (prefilled)] │
│ Qty:  [50 → 25]           │
│ Unit: [kg  → bags]        │
│                             │
│ [💾 Save]  [✕ Cancel]    │
└─────────────────────────────┘

CLICK SAVE ➜ TABLE UPDATES:
│ Coffee   │ 25    │ bags   │ ✅ Save
│ (quantity changed!)           │
```

### Test Checklist:
- [ ] Modal opens with current values
- [ ] Can edit any field
- [ ] Save button updates table
- [ ] Changes persist after refresh
- [ ] Cancel button closes without changes

---

## 🗑️ Delete Item

```
CLICK DELETE ➜ CONFIRMATION:

Confirm Dialog:
"Are you sure you want to delete this item?"
[OK]  [Cancel]

CLICK OK ➜ ITEM REMOVED:
• Disappears from table immediately ✨
• Dashboard counts update
• Changes persist after refresh

CLICK CANCEL ➜ NOTHING HAPPENS:
• Item stays in table
• No changes made
```

### Test Checklist:
- [ ] Confirmation dialog appears
- [ ] OK removes item
- [ ] Cancel preserves item
- [ ] Deletion persists after refresh

---

## 📈 Status Calculation Logic

```
STATUS IS CALCULATED AS:

IF expiry_date < today     ➜ ❌ EXPIRED     (RED)
   AND days_until_expiry    ➜ RED priority

IF 0 < days_until_expiry ≤ 7 ➜ ⏰ EXPIRING SOON (YELLOW)
   (within next 7 days)     ➜ YELLOW priority

IF quantity ≤ reorder_threshold ➜ 📉 LOW STOCK (ORANGE)
   (stock critical)          ➜ ORANGE priority

IF none above              ➜ ✅ OK          (GREEN)
   (everything healthy)

PRIORITY: Expired > Expiring Soon > Low Stock > OK
(First matching condition wins)
```

### Status Examples:
| Item | Expiry | Qty | Threshold | Status | Color |
|------|--------|-----|-----------|--------|-------|
| Coffee | Never | 50 | 10 | ✅ OK | Green |
| Milk | Tomorrow | 10 | 5 | ⏰ Expiring | Yellow |
| Tea | In 10 days | 3 | 10 | 📉 Low Stock | Orange |
| Cookies | Yesterday | 100 | 5 | ❌ Expired | Red |

### Test Checklist:
- [ ] OK status = green badge
- [ ] Expiring Soon = yellow badge
- [ ] Low Stock = orange badge
- [ ] Expired = red badge
- [ ] Dashboard counts match statuses

---

## 🧪 Test Scenarios (Quick Tests)

### Scenario 1: Fresh Start (5 minutes)
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page
3. Should see empty inventory with "No items" message
4. Add 1-2 items
5. Check dashboard shows correct counts
6. ✅ PASS = Dashboard appears with counts
```

### Scenario 2: Add & Search (5 minutes)
```
1. Add item "Coffee"
2. Add item "Tea"
3. Search "Coffee"
4. Should show only Coffee
5. Clear search
6. Should show both
7. ✅ PASS = Search filters immediately
```

### Scenario 3: AI Feature (2 minutes)
```
1. Have items in inventory
2. Go to AI Insights tab
3. Should get report with recommendations
4. Check source in browser console
5. ✅ PASS = Report appears with recommendations
```

### Scenario 4: Persistence (3 minutes)
```
1. Add item "Test"
2. Press F5 (refresh)
3. Item should still be there
4. Edit quantity to 99
5. Press F5 again
6. Quantity should still be 99
7. ✅ PASS = Data survives refresh
```

---

## 🛠️ Troubleshooting Quick Guide

| Problem | Solution |
|---------|----------|
| Items not appearing | Refresh page, check backend running |
| Search not working | Type slowly, wait for filter |
| UI looks broken | Hard refresh (Ctrl+Shift+R) |
| AI showing error | Check ANTHROPIC_API_KEY in .env |
| Edit/Delete not working | Check browser console (F12) for errors |
| Counts wrong on dashboard | Refresh page or check status logic |

---

## 📱 Responsive Design Check

### Desktop (1440px+)
- [ ] All cards in 1 row
- [ ] Table scrolls horizontally if needed
- [ ] Buttons side-by-side

### Tablet (768px)
- [ ] Cards stack 2 per row
- [ ] Form fields wrap nicely
- [ ] Touch-friendly buttons

### Mobile (<768px)
- [ ] Cards stack 1 per row (vertical)
- [ ] Table scrolls horizontally
- [ ] Buttons stack vertically
- [ ] Mobile-friendly form

Test by resizing browser or using F12 → Toggle device toolbar

---

## 🎉 Success Criteria

Your app is working great when:
- ✅ Dashboard shows all metrics
- ✅ Can add items with AI auto-fill
- ✅ Can edit/delete items
- ✅ Search & filter work
- ✅ Can see AI recommendations
- ✅ Data persists after refresh
- ✅ Status badges are correct
- ✅ Form validation prevents bad data
- ✅ UI looks modern and polished (gradients, shadows, icons)
- ✅ No red errors in browser console

**When all of these are ✅, you're ready to demo!**

---

## 🚀 Demo Script (2 minutes)

```
1. "Let me show you the dashboard" → Go to Dashboard tab
   → Point out metrics, sustainability score

2. "Now let me add an item" → Inventory tab, Add Item
   → Type "Coffee", click AI Auto-Fill, watch it populate
   → Submit

3. "It's in the table with AI suggestion" → Point at row
   → Click Edit, change quantity, save

4. "Smart search and filters" → Type "Coffee", shows only Coffee
   → Filter by status, shows relevant items

5. "AI insights for recommendations" → Go to AI Insights tab
   → Show report with suggestions

6. "Track sustainability" → Go to Dashboard
   → Point out Sustainability Score (waste reduction %)

"That's the Green-Tech Inventory Assistant!"
```

---

**Use this sheet as a quick reference while testing! Good luck! 🌱**
