from django.http import JsonResponse
from rest_framework.response import Response

# when not using classes, use line below to get decorator, then add decorator above each function
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# using these two imports to customize token claims
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import NoteSerializer
from base.models import Note

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        # to get username
        token['username'] = user.username
        #...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    
    # First route to get token, second route to refresh token
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    
    # When using Response you don't have to use safe=False in parenthesis
    return Response(routes)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNotes(request):
    user = request.user
    notes = user.note_set.all()
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)