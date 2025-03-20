from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.core.management import call_command

@receiver(post_migrate)
def load_initial_data(sender, **kwargs):
    if sender.name == 'authentication':
        call_command('loaddata', 'fixtures/authentication_role_202503201130.json')
        call_command('loaddata', 'fixtures/authentication_employee_202503201130.json')
        call_command('loaddata', 'fixtures/authentication_customer_202503201131.json')
    elif sender.name == 'medicines':
        call_command('loaddata', 'fixtures/medicines_catalog_202503201131.json')
        call_command('loaddata', 'fixtures/medicines_origin_202503201131.json')
        call_command('loaddata', 'fixtures/medicines_unit_202503201131.json')
        call_command('loaddata', 'fixtures/medicines_supplier_202503201132.json')
        call_command('loaddata', 'fixtures/medicines_medicine_202503201132.json')
    elif sender.name == 'sales':
        call_command('loaddata', 'fixtures/sales_order_202503201132.json')
        call_command('loaddata', 'fixtures/sales_orderdetail_202503201132.json')
        call_command('loaddata', 'fixtures/sales_payment_202503201132.json')
        call_command('loaddata', 'fixtures/sales_paymentdetail_202503201133.json')