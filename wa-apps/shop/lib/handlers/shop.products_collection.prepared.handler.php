<?php

class shopShopProducts_collectionPreparedHandler extends waEventHandler
{
    public function execute(&$params, $event_name = null)
    {
        if(waRequest::get('sort') == 'price' && waRequest::get('order') == 'asc')
            $params->orderBy('p.price = 0.0000, p.price, p.id', 'asc');
    }
}
