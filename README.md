Wooops... It is too secret.

_____________________________

--> new CanvasObject(options)

������� ����������� �����  
����� �������������� ��� ������������ ������, � ���� ������ ����������
������������ ���� ���������� ������������ ��������� �� �������
�� ��������� �������.

��� �� �������� ������� ��� �������� ������ ����������� �������.

�� ���� ��� - ����� ���� ����������� ���������, �� ����� ������������
�������� ��� ������ � ����������� �������.

options:  
{  
id      : string or numeric,  
drawing : new Drawing(width,height),  
now     : {...properties...},  
...  
}

_____________________________

--> new Curve(options)

����� ������������ ������� "������"

var curve = new Curve({  
    id: "my wonder curve",  
    now: {  
        ...  
        points  : [ [x1,y1], [x2,y2] ]  
        ...  
    }  
})