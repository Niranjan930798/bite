from rest_framework.decorators import api_view
from rest_framework.response import Response
import os

from .models import User, Hotel, HotelOwner,Food,FoodMenu,CartItem,Cart
from .serializers import UserSerializer, HotelSerializer, HotelOwnerSerializer,FoodSerializer,FoodMenuSerializer,CartItemSerializer,CartSerializer


# ================= ADMIN =================

@api_view(["POST"])
def admin_login(request):
    contact = request.data.get("contact")
    password = request.data.get("password")

    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not contact or not password:
        return Response({"message": "All fields are required"}, status=400)

    if contact == admin_email and password == admin_password:
        return Response({
            "message": "Admin login successful",
            "role": "admin"
        })

    return Response({"message": "Invalid admin credentials"}, status=401)


@api_view(["GET"])
def admin_dashboard_counts(request):
    total = Hotel.objects.count()
    approved = Hotel.objects.filter(approved=True, rejected=False).count()
    pending = Hotel.objects.filter(approved=False, rejected=False).count()
    rejected = Hotel.objects.filter(rejected=True).count()

    return Response({
        "total": total,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
    })


@api_view(["GET"])
def admin_pending_hotels(request):
    hotels = Hotel.objects.filter(approved=False, rejected=False)
    serializer = HotelSerializer(hotels, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def admin_approved_hotels(request):
    hotels = Hotel.objects.filter(approved=True, rejected=False)
    serializer = HotelSerializer(hotels, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def admin_rejected_hotels(request):
    hotels = Hotel.objects.filter(rejected=True)
    serializer = HotelSerializer(hotels, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def admin_all_hotels(request):
    hotels = Hotel.objects.all()
    serializer = HotelSerializer(hotels, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def approve_hotel(request):
    hotel_id = request.data.get("hotel_id")

    if not hotel_id:
        return Response({"message": "Hotel ID is required"}, status=400)

    try:
        hotel = Hotel.objects.get(id=hotel_id)
        hotel.approved = True
        hotel.rejected = False
        hotel.save()

        return Response({"message": "Hotel approved ✅"})
    except Hotel.DoesNotExist:
        return Response({"message": "Hotel not found"}, status=404)


@api_view(["POST"])
def reject_hotel(request):
    hotel_id = request.data.get("hotel_id")

    if not hotel_id:
        return Response({"message": "Hotel ID is required"}, status=400)

    try:
        hotel = Hotel.objects.get(id=hotel_id)
        hotel.rejected = True
        hotel.approved = False
        hotel.save()

        return Response({"message": "Hotel rejected ❌"})
    except Hotel.DoesNotExist:
        return Response({"message": "Hotel not found"}, status=404)


@api_view(["POST"])
def delete_hotel(request):
    hotel_id = request.data.get("hotel_id")

    if not hotel_id:
        return Response({"message": "Hotel ID is required"}, status=400)

    try:
        hotel = Hotel.objects.get(id=hotel_id)
        hotel.delete()

        return Response({"message": "Hotel deleted 🗑️"})
    except Hotel.DoesNotExist:
        return Response({"message": "Hotel not found"}, status=404)


# ================= USER =================

@api_view(["POST"])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"})
    return Response(serializer.errors, status=400)


@api_view(["POST"])
def login(request):
    contact = request.data.get("contact")
    password = request.data.get("password")

    if not contact or not password:
        return Response({"message": "All fields are required"}, status=400)

    try:
        user = User.objects.get(contact=contact, password=password)
        return Response({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "contact": user.contact
            }
        })
    except User.DoesNotExist:
        return Response({"message": "Invalid credentials"}, status=401)


# ================= HOTEL OWNER =================

@api_view(["POST"])
def hotel_owner_signup(request):
    serializer = HotelOwnerSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Hotel owner account created successfully"},
            status=201
        )

    return Response(serializer.errors, status=400)


@api_view(["POST"])
def hotel_login(request):
    contact = request.data.get("contact")
    password = request.data.get("password")

    if not contact or not password:
        return Response({"message": "All fields are required"}, status=400)

    try:
        owner = HotelOwner.objects.get(contact=contact, password=password)

        return Response({
            "message": "Login successful",
            "owner": {
                "id": owner.id,
                "username": owner.username,
                "contact": owner.contact
            }
        })

    except HotelOwner.DoesNotExist:
        return Response({"message": "Invalid credentials"}, status=401)


# ================= HOTEL DETAILS (Register hotel for approval) =================

@api_view(["POST"])
def add_hotel_details(request):
    serializer = HotelSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Hotel details submitted for admin approval"
        }, status=201)

    return Response(serializer.errors, status=400)


# ✅ Search hotel names for suggestions (typeahead)
@api_view(["GET"])
def search_hotel(request):
    query = request.GET.get("q", "")

    if len(query) < 1:
        return Response([])

    hotels = Hotel.objects.filter(hotel_name__icontains=query)[:10]

    data = []
    for h in hotels:
        status = "approved" if h.approved and not h.rejected else "rejected" if h.rejected else "pending"

        data.append({
            "id": h.id,
            "hotel_name": h.hotel_name,
            "status": status
        })

    return Response(data)


# ✅ Check hotel approval status
@api_view(["GET"])
def check_hotel_status(request):
    hotel_name = request.GET.get("hotel_name")

    if not hotel_name:
        return Response(
            {"status": "error", "message": "Hotel name is required"},
            status=400
        )

    try:
        hotel = Hotel.objects.get(hotel_name__iexact=hotel_name)

        if hotel.rejected:
            return Response({
                "status": "rejected",
                "message": "❌ Your hotel request is rejected by admin"
            })

        if hotel.approved:
            return Response({
                "status": "approved",
                "message": "✅ Your hotel is approved by admin"
            })

        return Response({
            "status": "pending",
            "message": "⏳ Your hotel approval is pending"
        })

    except Hotel.DoesNotExist:
        return Response({
            "status": "not_found",
            "message": "Hotel not found. Please register your hotel first"
        }, status=404)


#to add food item
@api_view(["POST"])
def add_food(request):
    hotel_name = request.data.get("hotel_name")
    category = request.data.get("category")
    food_name = request.data.get("food_name")
    price = request.data.get("price")
    description = request.data.get("description", "")

    # ✅ Validation
    if not hotel_name or not category or not food_name or price in [None, ""]:
        return Response({"message": "All fields are required"}, status=400)

    # ✅ Convert price to number
    try:
        price = int(price)
    except:
        return Response({"message": "Price must be a number"}, status=400)

    # ✅ Hotel must exist and be approved
    try:
        hotel = Hotel.objects.get(hotel_name__iexact=hotel_name)
    except Hotel.DoesNotExist:
        return Response({"message": "Hotel not found"}, status=404)

    if hotel.approved == False:
        return Response({"message": "Hotel is not approved yet"}, status=403)

    # ✅ Save Food in DB
    food = Food.objects.create(
        hotel=hotel,
        category=category,
        food_name=food_name,
        price=price,
        description=description
    )

    return Response(
        {"message": "Food added successfully ✅", "food_id": food.id},
        status=201
    )

#to serach food item
@api_view(["GET"])
def user_search_food(request):
    food_type = request.GET.get("type")
    food_name = request.GET.get("food")
    location = request.GET.get("location")

    if not food_type or not food_name or not location:
        return Response({"message": "type, food, location required"}, status=400)

    # ✅ only approved hotels + location match
    hotels = Hotel.objects.filter(
        approved=True,
        rejected=False,
        location__icontains=location
    )

    results = []

    for hotel in hotels:
        foods = Food.objects.filter(
            hotel=hotel,
            category__iexact=food_type,      # ✅ category is your type
            food_name__icontains=food_name
        )

        for f in foods:
            results.append({
                "hotel_name": hotel.hotel_name,
                "location": hotel.location,
                "food_name": f.food_name,
                "food_type": f.category,      # ✅ show category
                "price": f.price,
                "description": f.description,
            })

    return Response(results, status=200)

@api_view(["POST"])
def add_to_cart(request):
    user_id = request.data.get("user_id")
    food_id = request.data.get("food_id")

    if not user_id or not food_id:
        return Response({"message": "user_id and food_id required"}, status=400)

    # get user cart or create
    cart, created = Cart.objects.get_or_create(user_id=user_id)

    # check if item already exists
    item = CartItem.objects.filter(cart=cart, food_id=food_id).first()

    if item:
        item.quantity += 1
        item.save()
    else:
        CartItem.objects.create(cart=cart, food_id=food_id, quantity=1)

    return Response({"message": "Added to cart ✅"})


# ✅ Get cart items
@api_view(["GET"])
def get_cart(request, user_id):
    cart = Cart.objects.filter(user_id=user_id).first()

    if not cart:
        return Response({"items": []})

    serializer = CartSerializer(cart)
    return Response(serializer.data)


# ✅ Update quantity
@api_view(["POST"])
def update_cart_item(request):
    item_id = request.data.get("item_id")
    quantity = request.data.get("quantity")

    try:
        item = CartItem.objects.get(id=item_id)
        item.quantity = quantity
        item.save()
        return Response({"message": "Updated ✅"})
    except CartItem.DoesNotExist:
        return Response({"message": "Item not found"}, status=404)


# ✅ Remove item
@api_view(["POST"])
def remove_cart_item(request):
    item_id = request.data.get("item_id")

    try:
        CartItem.objects.get(id=item_id).delete()
        return Response({"message": "Removed ✅"})
    except CartItem.DoesNotExist:
        return Response({"message": "Item not found"}, status=404)
