<?php
return array(
    'wa_shop_names' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'entity_id' => array('int', 11, 'null' => 0),
        'name' => array('varchar', 255),
        ':keys' => array(
            'PRIMARY' => 'id',
        ),
    ),
);
