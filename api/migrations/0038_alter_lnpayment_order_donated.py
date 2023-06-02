# Generated by Django 4.2.1 on 2023-05-18 14:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0037_lnpayment_order_donated_alter_lnpayment_concept_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="lnpayment",
            name="order_donated",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="order_donated",
                to="api.order",
            ),
        ),
    ]