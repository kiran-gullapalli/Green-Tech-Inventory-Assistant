# 🧪 Feature Testing & Verification Guide

Complete instructions to test every feature of your Green-Tech Inventory Assistant.

---

## ✅ Pre-Testing Checklist

- [ ] Both servers running (backend on 3001, frontend on 3000)
- [ ] Browser showing http://localhost:3000
- [ ] `.env` file has valid `ANTHROPIC_API_KEY`
- [ ] No red errors in browser console (F12)
- [ ] Backend terminal showing "Server running on port 3001"

---

## 🎯 Feature 1: View Dashboard

### What to Test:
Dashboard displays inventory statistics and insights.

### How to Test:

1. **Open the app** → Click **📊 Dashboard** tab (should be default)
2. **Verify you see:**
   - ✅ Total Items count card
   - ✅ Expiring Soon count (with ⏰ icon)
   - ✅ Low Stock count (with 📉 icon)
   - ✅ Sustainability Score (with ♻️ icon)
   - ✅ Expired items count (with ❌ icon)

3. **Test the detail sections:**
   - Look for "Expiring Soonest" list
   - Look for "Low Stock Items" list
   - If database is empty, you'll see "✨ No items..." messages

**Expected Result:** Dashboard loads with all metrics showing. If you have sample data (from `npm run seed`), you'll see some items listed.

---

## 🎯 Feature 2: Add New Item

### What to Test:
Adding an item to inventory with AI-powered categorization.

### How to Test:

1. **Go to 📦 Inventory tab**
2. **Click ➕ Add Item button**
3. **Fill in the form:**
   - **Item Name:** "Coffee Beans" (required, min 2 chars)
   - **Category:** (leave blank for now)
   - **Quantity:** "50" (required, must be > 0)
   - **Unit:** "kg"
   - **Supplier:** "Local Fair Trade Co"
   - Leave other fields blank

4. **Click "AI Auto-Fill" button**
   - **What should happen:**
     - Category should auto-populate (e.g., "Perishable" or "Office Supply")
     - Unit should populate
     - Reorder Threshold should populate
     - Button shows "✨ Suggested by AI" in green
   - **If AI fails, fallback kicks in:** You'll still get defaults (Category: "Office Supply", Unit: "pcs", Threshold: 10)

5. **Submit the form** (click "Add Item")
   - **Expected:** Item appears immediately in the inventory table
   - **Verify:** "Coffee Beans" shows in the table with status "OK" (green badge)

**Test Source:** Check the console for `{ source: "ai" | "fallback" }` in the response

---

## 🎯 Feature 3: Search & Filter

### What to Test:
Finding items by name, category, and status.

### How to Test:

1. **Add at least 3 different items (use Feature 2 test)**

2. **Test Search by Name:**
   - Type "Coffee" in search box
   - **Expected:** Only Coffee Beans item shows in table
   - Clear search → All items show again

3. **Test Filter by Category:**
   - Click Category dropdown
   - Select "Perishable"
   - **Expected:** Only items with Perishable category show
   - Change filter → Table updates immediately

4. **Test Filter by Status:**
   - Click Status dropdown
   - Select "OK"
   - **Expected:** Only items with status "OK" show
   - Try other statuses (Low Stock, Expiring Soon)

5. **Combine filters:**
   - Search "Bean" + Category "Perishable" + Status "OK"
   - **Expected:** Only items matching ALL criteria show

**Expected Result:** Filters work independently and in combination. Table updates live as you type/select.

---

## 🎯 Feature 4: Edit Item

### What to Test:
Modifying an existing item's details.

### How to Test:

1. **From 📦 Inventory tab, find an item**
2. **Click ✏️ Edit button** (rightmost column of any row)
3. **Modal dialog appears with current values**
4. **Change something:**
   - Quantity: "50" → "25"
   - Unit: "kg" → "bags"
5. **Click Save**
   - **Expected:** Modal closes, table updates with new values
   - Quantity now shows "25", Unit shows "bags"

6. **Verify the edit persisted:**
   - Refresh page (F5)
   - **Expected:** Item still shows updated values
   - *This confirms data was saved to database*

**Expected Result:** Edit modal opens, changes are saved, page refresh shows persistence.

---

## 🎯 Feature 5: Delete Item

### What to Test:
Removing items from inventory.

### How to Test:

1. **From 📦 Inventory tab**
2. **Find any item you want to delete**
3. **Click 🗑️ Delete button**
4. **Confirmation dialog appears** — "Are you sure?"
5. **Click OK to confirm**
   - **Expected:** Item disappears from table immediately
   - Item count on dashboard decreases

6. **Refresh page (F5)**
   - **Expected:** Item is still gone
   - *This confirms delete was saved to database*

7. **Try canceling delete:**
   - Click Delete on another item
   - Click Cancel in confirmation
   - **Expected:** Item stays in table

**Expected Result:** Delete works, can undo by canceling, changes persist after refresh.

---

## 🎯 Feature 6: Status Calculation

### What to Test:
Items get correct status badges based on expiry date and quantity.

### How to Test:

1. **Add a new item with:**
   - Name: "Test Milk"
   - Quantity: "5"
   - Reorder Threshold: "10"  ← Lower than quantity
   - No expiry date
   - **Expected Status:** "OK" ✅ (green)

2. **Edit the item:**
   - Set Quantity to "8" (still less than threshold 10)
   - **Expected Status:** "Low Stock" 📉 (orange)
   - Refresh table to see updated status

3. **Add item with expiry:**
   - Name: "Test Yogurt"
   - Expiry: Set to tomorrow's date (within 7 days)
   - **Expected Status:** "Expiring Soon" ⏰ (yellow)

4. **Add item with past expiry:**
   - Name: "Old Food"
   - Expiry: Yesterday's date
   - **Expected Status:** "Expired" ❌ (red)

5. **Check Dashboard:**
   - "Expiring Soon" count should match items with status "Expiring Soon"
   - "Low Stock" count should match items with status "Low Stock"
   - "Expired" count should match expired items

**Expected Result:** All status badges are correct, counts on dashboard match items in inventory.

---

## 🎯 Feature 7: AI Insights Panel

### What to Test:
Getting AI-powered recommendations for your inventory.

### How to Test:

1. **Make sure you have items in inventory** (add some if empty)
2. **Click 🤖 AI Insights tab**
3. **Wait a moment** (it calls the API)
4. **You should see:**
   - **If AI works:** A text report analyzing your inventory:
     - "Items expiring within 7 days: X"
     - "Expired items: X"
     - "Low stock items: X"
     - "Recommendations..." (3+ suggestions)
     - Green badge: "🤖 Powered by AI"
   
   - **If AI fails:** Fallback report appears with:
     - Rule-based analysis (same metrics but calculated, not AI-generated)
     - Blue badge: "📋 Fallback Mode"

4. **Test fallback by breaking API:**
   - Edit `.env` and set `ANTHROPIC_API_KEY=invalid`
   - Refresh page
   - **Expected:** Fallback report appears (proves fallback works!)
   - Restore your real key: `ANTHROPIC_API_KEY=sk-ant-...`

**Expected Result:** AI Insights shows recommendations. If API fails, fallback kicks in (no error, graceful degradation).

---

## 🎯 Feature 8: Sustainability Score

### What to Test:
Calculating waste reduction metric based on inventory health.

### How to Test:

1. **Go to 📊 Dashboard**
2. **Find "Sustainability" score card** (with ♻️ icon)
3. **Score calculation:**
   - Score = (items not expired / total items) × 100
   - If you have 10 items total, 8 are good → Score = 80%

4. **Test by adding expired items:**
   - Add item with past expiry date
   - Go to Dashboard
   - **Expected:** Sustainability % should decrease

5. **Test by adding low-stock items:**
   - This doesn't affect sustainability score (it only counts expiry)
   - **Expected:** Score stays the same

**Expected Result:** Sustainability score correctly reflects inventory health (percentage shown, updates when items expire).

---

## 🎯 Feature 9: Sorting

### What to Test:
Sorting inventory table by different columns.

### How to Test:

1. **Go to 📦 Inventory tab**
2. **Click "📦 Item Name" header**
   - **Expected:** Items sort A→Z, header shows "↑"
   - Click again: Z→A, header shows "↓"

3. **Click "Qty" header**
   - **Expected:** Items sort by quantity (low to high)
   - Click again: high to low

4. **Click "Expiry" header**
   - **Expected:** Items sort by expiry date (nearest first)
   - Click again: furthest first

**Expected Result:** Clicking column headers sorts table, arrow shows sort direction.

---

## 🎯 Feature 10: Empty State Handling

### What to Test:
App behaves correctly when there's no data.

### How to Test:

1. **Delete all items from inventory:**
   - Go to 📦 Inventory tab
   - Click Delete on each item
   - Confirm each delete

2. **Verify empty states:**
   - ✅ Inventory table shows "📭 No items found"
   - ✅ Dashboard shows all counts as 0
   - ✅ "Expiring Soonest" list shows "✨ No items expiring soon"
   - ✅ "Low Stock Items" shows "✨ All items well-stocked"

3. **Add new item:**
   - **Expected:** Empty messages disappear, new item appears

**Expected Result:** App handles empty inventory gracefully with helpful messages.

---

## 🎯 Feature 11: Input Validation

### What to Test:
Form prevents invalid data.

### How to Test:

1. **Go to ➕ Add Item form**

2. **Try empty name:**
   - Leave name blank
   - Click Add
   - **Expected:** Red error message "Name required, min 2 chars"
   - Item NOT added

3. **Try invalid quantity:**
   - Name: "Test"
   - Quantity: "abc" or "-5" or "0"
   - Click Add
   - **Expected:** Red error message "Quantity must be positive"
   - Item NOT added

4. **Try expiry before purchase:**
   - Purchase Date: "2025-12-31"
   - Expiry Date: "2025-01-01" (earlier!)
   - Click Add
   - **Expected:** Red error "Expiry must be after purchase date"

5. **Try valid data:**
   - Name: "Valid Item"
   - Quantity: "50"
   - Click Add
   - **Expected:** Item added successfully

**Expected Result:** All validations work, errors are clear, invalid data rejected.

---

## 🎯 Feature 12: Data Persistence

### What to Test:
Data is saved and survives page refresh.

### How to Test:

1. **Add an item** (e.g., "Test Persistence")
2. **Note details:** Quantity 50, Status OK
3. **Press F5** (refresh page)
4. **Verify:**
   - ✅ Item still in table with same details
   - ✅ Dashboard counts unchanged
   - ✅ Status unchanged

5. **Edit the item:**
   - Change quantity to 25
   - Click Save
   - **Expected:** Table updates immediately

6. **Refresh page again**
   - **Expected:** Item still shows quantity 25
   - *This proves data is persisted to SQLite database*

**Expected Result:** Data persists across page refreshes and survives browser close/reopen.

---

## 📊 Complete Test Checklist

| Feature | Status | Notes |
|---------|--------|-------|
| View Dashboard | ⬜ | |
| Add Item | ⬜ | |
| Search & Filter | ⬜ | |
| Edit Item | ⬜ | |
| Delete Item | ⬜ | |
| Status Calculation | ⬜ | |
| AI Insights | ⬜ | |
| Sustainability Score | ⬜ | |
| Sorting | ⬜ | |
| Empty State | ⬜ | |
| Input Validation | ⬜ | |
| Data Persistence | ⬜ | |

**Mark each as:**
- ✅ PASS - Works as expected
- ⚠️ PARTIAL - Works but has minor issues
- ❌ FAIL - Doesn't work
- ⬜ NOT TESTED

---

## 🐛 Browser Developer Tools

### How to Debug Issues

**Open Developer Tools:** Press `F12`

**Check Console for Errors:**
1. Click **Console** tab
2. Look for red error messages
3. Errors tell you what went wrong
4. Share error messages when reporting bugs

**Check Network Requests:**
1. Click **Network** tab
2. Perform an action (add item, search, etc.)
3. Look for API calls (like `/api/inventory`)
4. Check if they return `200` (success) or error codes
5. Click request to see request/response details

**Check Local Storage:**
1. Click **Application** tab
2. Expand **Local Storage**
3. Your app should not store sensitive data here (security ✅)

---

## ✨ Pro Testing Tips

### 1. Test with Different Data
```
Good names to test: "Coffee", "Milk", "Server Equipment", "Chemicals"
Edge cases: Items with 0 quantity, -1 days to expiry, no category
```

### 2. Test Edge Cases
- **Empty strings:** Quantity "0", Quantity with spaces
- **Large numbers:** Quantity "999999", Reorder "1000"
- **Special characters:** Name "Item's & Co.", Notes with emojis
- **Dates:** Very far future (2099), very far past (1990)

### 3. Rapid Testing
Order to test features fastest:
1. Add Item (Feature 2)
2. View Dashboard (Feature 1)
3. Search/Filter (Feature 3)
4. Status Calculation (Feature 6)
5. Edit/Delete (Features 4-5)

### 4. Device Testing
- Try on mobile browser (right-click → Inspect → Toggle device toolbar)
- Resize browser window to test responsive design
- Expected: UI adapts to screen size

---

## 📞 Report Issues

When reporting a bug, include:
1. **What you did** - Step-by-step
2. **What you expected** - Should happen
3. **What actually happened** - Error message or wrong behavior
4. **Browser console errors** (F12 → Console)
5. **Screenshots** or video if helpful

**Example:** "Added item named 'Test' but got error 'Connection refused'. Backend isn't running."

---

## 🎉 You're Ready!

You now have a complete testing guide. Go ahead and verify all features work correctly!

For issues with the AI features, ensure:
- `.env` has valid `ANTHROPIC_API_KEY`
- Backend is running and showing no errors
- Browser console shows no CORS errors

Good luck! 🚀
