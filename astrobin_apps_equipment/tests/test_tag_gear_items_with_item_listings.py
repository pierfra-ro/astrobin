from django.test import TestCase

from astrobin.tests.generators import Generators
from astrobin_apps_equipment.templatetags.astrobin_apps_equipment_tags import gear_items_with_brand_listings, \
    gear_items_with_item_listings
from astrobin_apps_equipment.tests.equipment_generators import EquipmentGenerators


class TestTagGearItemsWithItemListings(TestCase):
    def test_no_listings(self):
        image = Generators.image()

        self.assertEqual(0, gear_items_with_item_listings(image, 'us').count())

    def test_with_gear_but_no_listings(self):
        telescope = Generators.telescope()

        image = Generators.image()
        image.imaging_telescopes.add(telescope)

        self.assertEqual(0, gear_items_with_item_listings(image, 'us').count())

    def test_with_gear_and_listing_in_wrong_country(self):
        listing = EquipmentGenerators.equipment_item_listing()
        listing.retailer.countries = "ch"
        listing.retailer.save()

        telescope = Generators.telescope()
        telescope.equipment_item_listings.add(listing)

        image = Generators.image()
        image.imaging_telescopes.add(telescope)

        self.assertEqual(0, gear_items_with_item_listings(image, 'us').count())

    def test_with_gear_and_listing_in_no_country(self):
        listing = EquipmentGenerators.equipment_item_listing()

        telescope = Generators.telescope()
        telescope.equipment_item_listings.add(listing)

        image = Generators.image()
        image.imaging_telescopes.add(telescope)

        self.assertEqual(1, gear_items_with_item_listings(image, 'us').count())

    def test_with_gear_and_listing_in_right_country(self):
        listing = EquipmentGenerators.equipment_item_listing()
        listing.retailer.countries = "us"
        listing.retailer.save()

        telescope = Generators.telescope()
        telescope.equipment_item_listings.add(listing)

        image = Generators.image()
        image.imaging_telescopes.add(telescope)

        self.assertEqual(1, gear_items_with_item_listings(image, 'us').count())
