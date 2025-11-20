# TODO: Fix params Promise error in Next.js dynamic route

## Tasks
- [ ] Fix params handling in `Frontend/app/dashboard/reports/[id]/page.jsx`: Await `params` and destructure `id`
- [ ] Remove incorrect `params` from `Frontend/app/dashboard/reports/page.jsx` function signature
- [ ] Update `router.push` in `Frontend/app/dashboard/upload/page.jsx` to use dynamic id from upload/analyze response instead of hardcoded '1'
- [ ] Test navigation to reports page after upload
- [ ] Verify no more params Promise errors
