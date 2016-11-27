from debug_toolbar.panels.templates import TemplatesPanel as BaseTemplatesPanel

# http://stackoverflow.com/questions/38569760/django-debug-toolbar-template-object-has-no-attribute-engine

class TemplatesPanel(BaseTemplatesPanel):
    def generate_stats(self, *args):
        template = self.templates[0]['template']
        if not hasattr(template, 'engine') and hasattr(template, 'backend'):
            template.engine = template.backend
        return super(TemplatesPanel, self).generate_stats(*args)