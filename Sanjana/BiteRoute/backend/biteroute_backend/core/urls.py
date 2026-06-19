from django.urls import path
from .views import *

urlpatterns = [
     # ✅ USER
    path("users/register/", register),
    path("users/login/", login),
    path("user/search-food/", user_search_food),

    # ✅ HOTEL OWNER
    path("hotels/signup/", hotel_owner_signup),
    path("hotels/login/", hotel_login),
    path("foods/add/", add_food),

    # ✅ HOTEL DETAILS
    path("hotels/details/", add_hotel_details),
    path("hotels/search/", search_hotel),
    path("hotels/check-status/", check_hotel_status),

    # ✅ ADMIN
    path("admin/login/", admin_login),
    path("admin/dashboard-counts/", admin_dashboard_counts),

    path("admin/pending-hotels/", admin_pending_hotels),
    path("admin/approved-hotels/", admin_approved_hotels),
    path("admin/rejected-hotels/", admin_rejected_hotels),
    path("admin/all-hotels/", admin_all_hotels),

    path("admin/approve-hotel/", approve_hotel),
    path("admin/reject-hotel/", reject_hotel),
    path("admin/delete-hotel/", delete_hotel),

    #cart
    path("cart/add/", add_to_cart),
    path("cart/<int:user_id>/", get_cart),
    path("cart/update/", update_cart_item),
    path("cart/remove/", remove_cart_item),
]
