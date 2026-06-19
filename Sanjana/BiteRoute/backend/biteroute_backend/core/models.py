from django.db import models

# Create your models here.
class User(models.Model):
    name=models.CharField(max_length=100)
    contact=models.CharField(max_length=100,unique=True)
    password=models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class HotelOwner(models.Model):
    username = models.CharField(max_length=100)
    contact = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=100)
    
    def __str__(self):
        return self.username
    


class Hotel(models.Model):
    hotel_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    food_type = models.CharField(max_length=300)
    open_time = models.TimeField()
    close_time = models.TimeField()
    description = models.TextField(blank=True)
    approved = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)

    def __str__(self):
        return self.hotel_name
    
class HotelStatusCount(models.Model):
    total_hotels = models.IntegerField(default=0)
    approved_hotels = models.IntegerField(default=0)
    pending_hotels = models.IntegerField(default=0)
    rejected_hotels = models.IntegerField(default=0)

    def __str__(self):
        return "Hotel Status Count"



class Food(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="foods")
    category = models.CharField(max_length=100)
    food_name = models.CharField(max_length=200)
    price = models.IntegerField()
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.food_name} ({self.hotel.hotel_name})"


class FoodMenu(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    food_type = models.CharField(max_length=100)
    food_name = models.CharField(max_length=200)
    price = models.IntegerField()

    def __str__(self):
        return self.food_name
    

class Cart(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart - {self.user.name}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    food = models.ForeignKey("Food", on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.food.food_name} ({self.quantity})"