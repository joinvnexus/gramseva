# GramSeva UI/UX Complete - TODO List

## ✅ COMPLETED (Responsive Navigation)
- [✅] Header desktop nav + mobile drawer
- [✅] BottomNav mobile tabs (role-aware: admin/provider/user)
- [✅] Proper padding (pb-20 md:pb-0)
- [✅] No duplication/conflicts
- [✅] UI components: Button/Input/EmptyState/ErrorState/PageTransition/Skeleton/VisuallyHidden

**Git Status:** `blackboxai/responsive-nav-fix` branch, all files staged/committed

---

## 🔴 PRIORITY 1: Critical Fixes (Phase 1)

### 1. Loading Skeletons [HIGH]
```
[ ] Services list → StatsCardSkeleton + SkeletonCard
[ ] Reports list → ReportCard skeleton  
[ ] Market prices → SkeletonTable
[ ] All dashboards → StatsCardSkeleton
[ ] Profile pages → User avatar skeleton
```
**Files:** Create `components/ui/SkeletonCard.tsx`, update pages

### 2. Admin Markets CRUD [CRITICAL]
```
[ ] /admin/markets → Add New Haat modal
[ ] Update Price modal
[ ] Enable/disable toggle
[ ] Price history table
```
**Files:** `admin/markets/page.tsx` + modals

### 3. Admin Users Management [HIGH]
```
[ ] Search/filter by role/name/phone
[ ] Edit/Delete user
[ ] Verification toggle
[ ] Pagination
```
**Files:** `admin/users/page.tsx`

### 4. Admin Services CRUD [HIGH]
```
[ ] Service approval workflow
[ ] Edit/delete service
[ ] Category management
```
**Files:** `admin/services/page.tsx`

### 5. Empty States Everywhere [MEDIUM]
```
[ ] Bookings (/bookings)
[ ] My services (/services/my)
[ ] Admin users/services/reports
```
**Template:** EmptyState component already ready

---

## 🟡 PRIORITY 2: UI Enhancements (Phase 2)

```
[ ] Sort/filter: Services/Reports (price/rating/status)
[ ] Charts: Dashboards (Recharts)
[ ] Image upload: Service creation + Reports
[ ] Mobile: Swipe gestures + pull-to-refresh
```

---

## 🟢 PRIORITY 3: Polish (Phase 3)

```
[ ] Offline: Cache lists + background sync
[ ] Voice commands navigation
[ ] Animations (framer-motion)
[ ] Performance (image opt, lazy load)
```

---

## 📋 Next Steps
```
1. git checkout main && git merge blackboxai/responsive-nav-fix
2. git push origin main
3. Start Phase 1: Skeletons → Admin CRUD
```

**Status:** Navigation complete. Phase 1 pending.
