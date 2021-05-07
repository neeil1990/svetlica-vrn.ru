<?php

return array(
    'name' => 'Свойства заказа',
    'img'  => 'img/order.png',
    'frontend' => true,
    'handlers' => array(
        'cart_add' => 'cartAdd',
        'order_action.create' => 'orderActionCreate'
    ),
);
