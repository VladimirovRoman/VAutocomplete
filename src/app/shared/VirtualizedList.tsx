import { Card, CardContent, ListSubheader, Popper, Typography, autocompleteClasses, styled } from "@mui/material";
import React from "react";
import { ListChildComponentProps, VariableSizeList } from "react-window";

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
        ...style,
        top: (style.top as number) + LISTBOX_PADDING,
    };

    if (dataSet.hasOwnProperty('group')) {
        return (
            <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
                {dataSet.group}
            </ListSubheader>
        );
    }
    return (
        <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
            <Card variant="outlined">
                <CardContent style={{ backgroundColor: index % 2 === 0 ? 'white' : 'lightgray' }}>
                    name: {dataSet[1].name}
                    <br />
                    email : {dataSet[1].email}
                    <br />
                    body : {dataSet[1].body}
                </CardContent>
            </Card>
        </Typography>
    );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

export const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function ListboxComponent(props, ref) {
        const { children, ...other } = props;
        const itemData: React.ReactElement[] = [];
        (children as React.ReactElement[]).forEach(
            (item: React.ReactElement & { children?: React.ReactElement[] }) => {
                itemData.push(item);
                itemData.push(...(item.children || []));
            }
        );

        const itemCount = itemData.length;
        const itemSize = 120;

        const getChildSize = (child: React.ReactElement) => {
            if (child.hasOwnProperty('group')) {
                return 48;
            }
            return itemSize;
        };

        const getHeight = () => {
            if (itemCount > 8) {
                return 8 * itemSize;
            }
            return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
        };

        const gridRef = useResetCache(itemCount);

        return (
            <div ref={ref}>
                <OuterElementContext.Provider value={other}>
                    <VariableSizeList
                        itemData={itemData}
                        height={getHeight() + 2 * LISTBOX_PADDING}
                        width={700}
                        ref={gridRef}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={(index) => getChildSize(itemData[index])}
                        overscanCount={5}
                        itemCount={itemCount}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>
        );
    }
);

export const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    },
});
