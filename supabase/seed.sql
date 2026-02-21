-- Seed data from src/data/sample-data.ts (ASCII-safe)
-- Safe to re-run.

insert into public.categories (id, name, slug, description, hero_image)
values
  ('cat-ics', 'Integrated Circuits', 'integrated-circuits',
   'Microcontrollers, drivers, amplifiers, converters and ASICs.',
   '/images/categories/ics.jpg'),
  ('cat-elec-comp', 'Electronic Components', 'electronic-components',
   'Connectors, resistors, capacitors, and essential components for every build.',
   '/images/categories/ec-comp.jpg'),
  ('cat-sensors', 'Sensors', 'sensors',
   'Smart sensing modules for motion, gas, flame, and color.',
   '/images/categories/sensors.jpg'),
  ('cat-motors', 'Motors', 'Motors',
   'Motors, drivers, and pumps built for motion projects.',
   '/images/categories/motors.jpg')
on conflict (id) do nothing;

insert into public.subcategories (id, category_id, name, slug)
values
  ('sub-ics-mcu', 'cat-ics', 'Microcontrollers', 'microcontrollers'),
  ('sub-ics-power', 'cat-ics', 'Power Management', 'power-management'),
  ('sub-ics-signal', 'cat-ics', 'Signal Processing', 'signal-processing'),
  ('sub-ec-connectors', 'cat-elec-comp', 'Connectors', 'connectors'),
  ('sub-ec-resistors', 'cat-elec-comp', 'Resistors', 'resistors'),
  ('sub-ec-capacitors', 'cat-elec-comp', 'Capacitors', 'capacitors'),
  ('sub-sens-color', 'cat-sensors', 'Color Sensors', 'Color Sensors'),
  ('sub-sens-gas', 'cat-sensors', 'Gas Sensors', 'Gas Sensors'),
  ('sub-sens-Flame', 'cat-sensors', 'Flame Sensors', 'Flame Sensors'),
  ('sub-dc-motors', 'cat-motors', 'DC Motor', 'DC Motor'),
  ('sub-motor-driver', 'cat-motors', 'Motor Driver', 'Motor Driver'),
  ('sub-dc-pumps', 'cat-motors', 'DC Pumps', 'DC Pumps')
on conflict (id) do nothing;

insert into public.brands (id, name, description)
values
  ('brand-epf', 'Robocoz Labs',
   'Premium components engineered for demanding applications.'),
  ('brand-omega', 'Omega Circuits',
   'Industrial-grade PCB assemblies.')
on conflict (id) do nothing;

insert into public.products (
  id,
  name,
  slug,
  sku,
  summary,
  description,
  category_id,
  subcategory_id,
  brand_id,
  specs,
  datasheet_url,
  price,
  volume_pricing,
  images,
  in_stock,
  min_order_qty,
  rating,
  tags,
  featured
)
values
  (
    'prod-1',
    'EPF STM32F4 Core Module',
    'epf-stm32f4-core-module',
    'EPF-STM32F4-01',
    'High-performance STM32F4 module with integrated PMIC and industrial IO.',
    'A production-ready compute module featuring STM32F4 MCU, on-board power, and flexible connectivity.',
    'cat-ics',
    'sub-ics-mcu',
    'brand-epf',
    '{
      "MCU": "STM32F407VGT6",
      "Clock": "168 MHz",
      "Flash": "1 MB",
      "RAM": "192 KB",
      "Temperature": "-40C to 85C"
    }'::jsonb,
    '#',
    48,
    '[{"minQty":10,"price":45},{"minQty":100,"price":41}]'::jsonb,
    array['/images/products/stm32f4.jpg'],
    340,
    1,
    4.9,
    array['featured','new'],
    true
  ),
  (
    'prod-2',
    'Omega High-Current Connector',
    'omega-high-current-connector',
    'OMG-HCC-16P',
    '16-pin high-current connector system rated up to 40A per contact.',
    'Modular connector with locking mechanism and gold-plated contacts for rugged environments.',
    'cat-elec-comp',
    'sub-ec-connectors',
    'brand-omega',
    '{
      "Contacts": "16",
      "Current": "40A",
      "Voltage": "600V",
      "Pitch": "5.08 mm"
    }'::jsonb,
    null,
    18.5,
    '[]'::jsonb,
    array['/images/products/connector.jpg'],
    780,
    10,
    4.7,
    array[]::text[],
    true
  ),
  (
    'prod-3',
    'EPF Precision IMU Module',
    'epf-precision-imu-module',
    'EPF-IMU-9AX',
    '9-axis IMU module with Kalman filtering and sensor fusion.',
    'Drop-in IMU solution with sensor fusion firmware targeting robotics and UAV applications.',
    'cat-sensors',
    'sub-sens-color',
    'brand-epf',
    '{
      "Gyro": "+/-2000 dps",
      "Accel": "+/-16g",
      "Mag": "+/-14 gauss",
      "Interface": "I2C/SPI"
    }'::jsonb,
    null,
    72,
    '[]'::jsonb,
    array['/images/products/imu.jpg'],
    120,
    1,
    4.8,
    array[]::text[],
    false
  )
on conflict (id) do nothing;
