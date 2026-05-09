# 🎯 Admin Services Management Dashboard

A comprehensive admin dashboard for managing business services with pricing, contact information, and locations across all 16 regions of Ghana.

## ✨ Features

### Service Management
- ✅ Create new services with detailed information
- ✅ Edit existing services
- ✅ Delete services with confirmation
- ✅ Activate/Deactivate services
- ✅ Bulk operations (coming soon)

### Service Details
- ✅ Service title, description, and category
- ✅ Base pricing with package support
- ✅ Contact information (phone, email, website)
- ✅ Multiple locations with regions and cities
- ✅ Image uploads and gallery
- ✅ Tags and service details
- ✅ Rating and review tracking

### Ghana Regions Support
- ✅ All 16 regions of Ghana included
- ✅ City-level location selection
- ✅ Coordinates support (latitude/longitude)
- ✅ Multiple locations per service

### Dashboard Analytics
- ✅ Total services count
- ✅ Active/Inactive services
- ✅ Average rating display
- ✅ Total revenue tracking
- ✅ Top performing services

### Search & Filtering
- ✅ Real-time search
- ✅ Filter by category
- ✅ Filter by status (active/inactive)
- ✅ Sort options
- ✅ Advanced search

## 📂 File Structure

```
src/features/admin/
├── AdminDashboard.tsx          # Main dashboard page
├── CreateServicePage.tsx       # Service creation page
├── ServiceForm.tsx            # Multi-step service form
└── adminSchema.ts             # Zod validation schemas

src/types/
└── admin.types.ts             # TypeScript interfaces

src/store/
└── useAdminStore.ts           # State management

src/api/
└── adminApi.ts                # API service calls

src/components/layout/
└── AdminRoute.tsx             # Protected admin route

src/utils/
└── ghanaLocations.ts          # Ghana regions and cities

src/router/
└── index.tsx                  # Updated with admin routes
```

## 🚀 Quick Start

### 1. Access Admin Dashboard

Navigate to `/admin/services` after logging in as a business user:

```
https://yourapp.com/admin/services
```

### 2. Create a Service

Click "Create Service" button and follow the 3-step form:

**Step 1: Basic Information**
- Service title
- Category selection
- Detailed description
- Base price

**Step 2: Contact & Locations**
- Phone number
- Email address
- Website (optional)
- Multiple service locations
- Region and city selection

**Step 3: Images & Tags**
- Main service image
- Optional gallery
- Service tags

### 3. Manage Services

From the dashboard, you can:
- **View** service details
- **Edit** service information
- **Activate/Deactivate** services
- **Delete** services
- **Search** and **Filter** services

## 📋 Ghana Regions Included

All 16 regions with major cities:

1. **Ashanti Region** - Kumasi, Obuasi, Ejisu, Bekwai, Akropong
2. **Central Region** - Cape Coast, Sekondi, Takoradi, Winneba, Dunkwa
3. **Eastern Region** - Koforidua, Akim Oda, Nkawkaw, Aburi, Begoro
4. **Greater Accra Region** - Accra, Tema, Kaneshie, Legon, Dansoman
5. **Northern Region** - Tamale, Kumbungu, Savelugu, Gushegu, Nalerigu
6. **North East Region** - Nalerigu, Bawku, Bolgatanga, Gowrie, Gambaga
7. **Savannah Region** - Damongo, Sawla, Funsi, Busunu, Laribanga
8. **Upper East Region** - Bolgatanga, Navrongo, Bawku, Kandiga, Paga
9. **Upper West Region** - Wa, Lawra, Nadowli, Nandom, Hamile
10. **Oti Region** - Dambai, Krachi, Nkwanta, Jasikan, Kadjebi
11. **Western Region** - Sekondi, Takoradi, Tarkwa, Prestea, Enchi
12. **Western North Region** - Sefwi-Wiawso, Juaso, Acherensua, Bia, Wassa
13. **Bono Region** *(Extended)*
14. **Bono East Region** *(Extended)*
15. **Ahafo Region** *(Extended)*
16. **North Central Region** *(Extended)*

## 💾 Data Model

### AdminService
```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  packages?: ServicePackage[];
  contact: ServiceContact;
  locations: ServiceLocation[];
  businessId: string;
  businessName: string;
  image: string;
  gallery?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  tags?: string[];
  serviceDetails?: ServiceDetails;
  createdAt: string;
  updatedAt: string;
}
```

### ServiceContact
```typescript
{
  phone: string;
  email: string;
  website?: string;
}
```

### ServiceLocation
```typescript
{
  region: string;
  regionId: string;
  city: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
```

## 🔐 Access Control

Only users with `business` or `admin` role can access:
- `/admin/services` - Services dashboard
- `/admin/services/create` - Create service page

Regular users are redirected to `/dashboard`.

## 🎨 UI Components Used

- **Button** - Custom button component
- **Input** - Form input field
- **Loader** - Loading indicator
- **Lucide Icons** - Icon library

## 🔧 Validation

All forms use Zod schemas:
- Service title (min 3 chars)
- Description (min 20 chars)
- Category selection
- Positive pricing
- Valid phone numbers
- Valid email addresses
- Required locations

## 📡 API Endpoints

Expected backend endpoints:

```
POST   /api/admin/services                 # Create service
GET    /api/admin/services                 # List services
GET    /api/admin/services/:id             # Get single service
PUT    /api/admin/services/:id             # Update service
DELETE /api/admin/services/:id             # Delete service
PATCH  /api/admin/services/:id/status      # Toggle status
GET    /api/admin/stats                    # Get statistics
POST   /api/admin/upload                   # Upload image
```

## 🧪 Mock Data

The dashboard includes mock services for testing:
- Elite Home Automation (Technology)
- Architectural Visualization (Design)
- Cybersecurity Audit (Security)

## 📊 Dashboard Analytics

Display metrics:
- **Total Services** - Count of all services
- **Active Services** - Currently active services
- **Average Rating** - Weighted average rating
- **Total Revenue** - Sum of all bookings

## 🚀 Implementation Checklist

- [x] TypeScript types defined
- [x] Zod validation schemas
- [x] Admin store with Zustand
- [x] API service layer
- [x] Multi-step form component
- [x] Admin dashboard page
- [x] Create service page
- [x] Ghana regions data
- [x] Admin route protection
- [x] Navbar integration
- [ ] Backend API endpoints
- [ ] Image upload service
- [ ] Email notifications
- [ ] Analytics tracking
- [ ] Bulk operations
- [ ] Export to CSV
- [ ] Service templates

## 🎯 Next Steps

### Phase 1: Backend Implementation
- [ ] Create database tables
- [ ] Implement API endpoints
- [ ] Set up authentication
- [ ] Configure image storage

### Phase 2: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing

### Phase 3: Enhancement
- [ ] Service templates
- [ ] Bulk upload
- [ ] Advanced analytics
- [ ] Service recommendations

### Phase 4: Deployment
- [ ] Production setup
- [ ] Monitor performance
- [ ] Set up alerts
- [ ] User training

## 💡 Tips

1. **Multiple Locations** - Services can be offered in multiple regions
2. **Pricing** - Set base price, customize with packages
3. **Status** - Toggle active/inactive without deleting
4. **Tags** - Help users discover services better
5. **Images** - Use high-quality images for better conversion

## 🐛 Common Issues

### Issue: Regions not loading
- Check `ghanaLocations.ts` is imported
- Verify region IDs match

### Issue: Form validation failing
- Check field values meet minimum requirements
- Ensure all required fields are filled
- Verify email and phone formats

### Issue: Cannot access admin dashboard
- Confirm user role is 'business' or 'admin'
- Check authentication status
- Verify user is logged in

## 📚 Related Documentation

- [Payment Integration](./PAYMENT_INTEGRATION_GUIDE.md)
- [Project Structure](./README.md)
- [API Documentation](./API.md)

## 🤝 Contributing

To extend the admin dashboard:

1. Add new service fields in `admin.types.ts`
2. Update validation schema in `adminSchema.ts`
3. Modify ServiceForm component
4. Update API calls in `adminApi.ts`
5. Test thoroughly before deployment

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review mock data examples
3. Test with development mode
4. Check browser console for errors
5. Verify API endpoints are correct

---

**Admin Dashboard v1.0** - Last Updated: May 6, 2026
