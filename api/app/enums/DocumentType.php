<?php

namespace App\Enums;

enum DocumentType: string
{
    case Visa = 'visa';
    case Passport = 'passport';
    case SupportingDocument = 'supporting_document';
}
