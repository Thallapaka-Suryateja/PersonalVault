from django.shortcuts import render

# Create your views here.
from rest_framework import views, generics, permissions, response
from .models import ChatHistory, ChatSource
from .serializers import AskQuestionSerializer, ChatHistorySerializer
from .services import ask_question

class AskView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AskQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data['question']

        result = ask_question(request.user, question)

        chat = ChatHistory.objects.create(
            user=request.user,
            question=question,
            answer=result['answer'],
        )
        for chunk in result['sources']:
            ChatSource.objects.create(chat=chat, chunk=chunk)

        return response.Response({
            "id": chat.id,
            "question": question,
            "answer": result['answer'],
            "sources": [
                {
                    "filename": c.file.filename,
                    "page_number": c.page_number,
                    "chunk_text": c.chunk_text[:200],
                }
                for c in result['sources']
            ],
        })

class ChatHistoryListView(generics.ListAPIView):
    serializer_class = ChatHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatHistory.objects.filter(user=self.request.user)