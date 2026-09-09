<?php
return [
    'site' => [
        'name' => 'NEXmove Physio',
        'support_phone_display' => '020 1234 5678',
        'support_phone_e164' => '+442012345678',
        'whatsapp_e164' => '442012345678',
        'timezone' => 'Europe/London',
    ],
    'database' => [
        // Zero-configuration SQLite database. It is created automatically on first visit.
        'path' => dirname(__DIR__) . '/storage/nexmove.sqlite',
    ],
];
