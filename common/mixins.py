import simplejson as json

from django.http import HttpResponse

class AjaxableResponseMixin(object):
    """
    Mixin to add AJAX support to a form.
    Must be used with an object-based FormView (e.g. CreateView)
    """
    def render_to_json_response(self, context, **response_kwargs):
        data = json.dumps(context)
        response_kwargs['content_type'] = 'application/json'
        return HttpResponse(data, **response_kwargs)

    def form_invalid(self, form):
        if self.request.is_ajax():
            return self.render_to_json_response(form.errors, status=400)
        else:
            return super(AjaxableResponseMixin, self).form_invalid(form)

    def form_valid(self, form):
        if self.request.is_ajax():
            data = {
                'pk': form.instance.pk,
            }
            return self.render_to_json_response(data)
        else:
            return super(AjaxableResponseMixin, self).form_valid(form)


class RequestUserRestSerializerMixin(object):
    def create(self, validated_data):
        """Override ``create`` to provide a user via request.user by default.

        This is required since the read_only ``user`` field is not included by
        default anymore since https://github.com/encode/django-rest-framework/pull/5886.
        """
        if 'user' not in validated_data:
            validated_data['user'] = self.context['request'].user
        return super(RequestUserRestSerializerMixin, self).create(validated_data)
