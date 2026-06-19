from rest_framework import serializers
from .models import User,Hotel,HotelOwner,Food,FoodMenu,Cart,CartItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class HotelOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelOwner
        fields = "__all__"

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = "__all__"

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = "__all__"

class FoodMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodMenu
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source="food.food_name", read_only=True)
    price = serializers.IntegerField(source="food.price", read_only=True)
    hotel_name = serializers.CharField(source="food.hotel.hotel_name", read_only=True)
    location = serializers.CharField(source="food.hotel.location", read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "food", "food_name", "price", "hotel_name", "location", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items"]
