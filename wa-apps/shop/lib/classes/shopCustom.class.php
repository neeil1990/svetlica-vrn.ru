<?php

class shopCustom
{

    public static function p($data = false){
        if($data)
            return 'от';
        else
            return 'Цена от';
    }

    public static function array_filter($array, $field){

        if(!is_array($array) || empty($field))
            return false;

        $data = array_filter($array, function ($k) use ($field){

            return preg_match("/$field/", $k);
        }, ARRAY_FILTER_USE_KEY);

        return ($data) ?: false;
    }

}
