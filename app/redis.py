import os
import redis
from django.conf import settings

redis = redis.Redis(host=settings.REDIS_HOST,
                    port=settings.REDIS_PORT,
                    db=settings.REDIS_DB,
                    decode_responses=True,
                    password='5j426FnDKe')
