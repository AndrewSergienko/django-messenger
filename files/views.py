from django.conf import settings
from files.models import File
from .serializers import FileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class FileDownload(APIView):
    def get(self, request, pk, format=None):
        file = File.objects.get(id=pk)
        serializer = FileSerializer(file)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FileUpload(APIView):
    def post(self, request, format=None):
        if settings.USE_SPACES:
            file = request.FILES['file']
            type = file.content_type
            data = {
                'file': file,
                'type': type,
                'user': request.user
            }
            upload = File(**data)
            upload.save()
            return Response({'url': upload.file.url}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)

